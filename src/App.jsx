import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const demoBooks=[
 {id:1,title:"昨日までの隣人",author:"とうま",genre:"SFミステリー",likes:128,views:2140,summary:"消えた隣人と、主人公だけが覚えている奇妙な記憶をめぐる物語。"},
 {id:2,title:"星降る街の約束",author:"NDC User",genre:"青春・ファンタジー",likes:94,views:1680,summary:"夜空から星が消え始めた街で、二人の高校生が真実を探す。"},
 {id:3,title:"プロトコル：ZERO",author:"NDC User",genre:"SF",likes:76,views:1102,summary:"人間の記憶を保存できる世界で、一つだけ存在しない記憶を追う。"}
];

function App(){
 const [page,setPage]=useState("home");
 const [session,setSession]=useState(null);
 const [authMode,setAuthMode]=useState("login");
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [message,setMessage]=useState("");
 const [selected,setSelected]=useState(null);
 const [book,setBook]=useState({title:"",genre:"",summary:"",body:"",public:true});

 useEffect(()=>{ if(!supabase)return; supabase.auth.getSession().then(({data})=>setSession(data.session)); const {data}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); return()=>data.subscription.unsubscribe(); },[]);

 async function auth(e){
   e.preventDefault(); setMessage("");
   if(!supabase){setMessage("Supabase未接続です。まず .env を設定してください。");return;}
   const result=authMode==="login"
    ? await supabase.auth.signInWithPassword({email,password})
    : await supabase.auth.signUp({email,password});
   if(result.error)setMessage(result.error.message);
   else {setMessage(authMode==="login"?"ログインしました。":"確認メールを送信しました。"); if(authMode==="login")setPage("mypage");}
 }
 async function logout(){if(supabase)await supabase.auth.signOut();setSession(null);setPage("home");}
 function requireLogin(next){if(!session){setPage("auth");setMessage("この機能を利用するにはログインが必要です。");}else setPage(next);}

 return <div className="app">
  <header>
   <button className="brand" onClick={()=>setPage("home")}><b>N</b><span><strong>Novel Development Center</strong><small>NDC</small></span></button>
   <nav>
    <button onClick={()=>setPage("discover")}>作品を探す</button>
    <button onClick={()=>requireLogin("create")}>小説を書く</button>
    {session?<><button onClick={()=>setPage("mypage")}>マイページ</button><button onClick={logout}>ログアウト</button></>:<button className="nav-strong" onClick={()=>setPage("auth")}>ログイン / 会員登録</button>}
   </nav>
  </header>

  {page==="home"&&<main className="home">
    <section className="hero"><div><p className="eyebrow">NOVEL DEVELOPMENT CENTER</p><h1>小説を創る。<br/><span>読んでもらう。</span></h1><p className="lead">AIと一緒に物語を作り、公開し、誰かに読んでもらう。NDCは小説制作と作品鑑賞をひとつにつなぐプラットフォームです。</p><div className="actions"><button className="primary" onClick={()=>requireLogin("create")}>小説を作る →</button><button className="secondary" onClick={()=>setPage("discover")}>作品を探す</button></div></div><div className="hero-panel"><div className="panel-label">CREATE → PUBLISH → DISCOVER</div><h2>あなたの物語が、<br/>誰かの物語になる。</h2><div className="stats"><span><b>∞</b><small>Stories</small></span><span><b>AI</b><small>Creation</small></span><span><b>★</b><small>Reviews</small></span></div></div></section>
    <section className="section"><div className="section-head"><div><p className="eyebrow">DISCOVER</p><h2>注目の作品</h2></div><button onClick={()=>setPage("discover")}>すべて見る →</button></div><div className="books">{demoBooks.map(b=><BookCard key={b.id} book={b} onClick={()=>{setSelected(b);setPage("book")}}/>)}</div></section>
  </main>}

  {page==="discover"&&<main className="page"><PageTitle eyebrow="DISCOVER" title="作品を探す" sub="公開された小説を読んで、お気に入りの作品を見つけよう。"/><div className="filter"><button className="active">すべて</button><button>SF</button><button>ファンタジー</button><button>ミステリー</button><button>青春</button></div><div className="books">{demoBooks.map(b=><BookCard key={b.id} book={b} onClick={()=>{setSelected(b);setPage("book")}}/>)}</div></main>}

  {page==="book"&&selected&&<main className="page"><button className="back" onClick={()=>setPage("discover")}>← 作品一覧</button><article className="book-detail"><p className="eyebrow">{selected.genre}</p><h1>{selected.title}</h1><p className="author">by {selected.author}</p><p className="summary">{selected.summary}</p><div className="book-actions"><button className="primary" onClick={()=>setMessage("本文表示は次の実装段階で接続します。")}>第1話を読む</button><button className="secondary" onClick={()=>setMessage("評価機能は次の実装段階で接続します。")}>★ 評価する</button></div><div className="notice">{message||"公開作品ページのUIです。本文・評価・コメント・お気に入りを後からSupabaseへ接続します。"}</div></article></main>}

  {page==="auth"&&<main className="auth-page"><div className="auth-card"><p className="eyebrow">ACCOUNT</p><h1>{authMode==="login"?"ログイン":"新規会員登録"}</h1><p>{authMode==="login"?"NDCにログインして作品を管理しましょう。":"無料でアカウントを作成して、小説を公開できます。"}</p><form onSubmit={auth}><label>メールアドレス<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"/></label><label>パスワード<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength="6" placeholder="6文字以上"/></label>{message&&<div className="notice">{message}</div>}<button className="primary full" type="submit">{authMode==="login"?"ログイン":"アカウントを作成"} →</button></form><button className="switch" onClick={()=>{setAuthMode(authMode==="login"?"signup":"login");setMessage("")}}>{authMode==="login"?"新規会員登録はこちら":"すでにアカウントをお持ちの方はこちら"}</button></div></main>}

  {page==="mypage"&&<main className="page"><PageTitle eyebrow="MY PAGE" title="マイページ" sub={session?.user?.email||"あなたの作品を管理できます。"}/><div className="dashboard"><div className="dash-card"><b>0</b><span>公開作品</span></div><div className="dash-card"><b>0</b><span>下書き</span></div><div className="dash-card"><b>0</b><span>お気に入り</span></div></div><button className="primary" onClick={()=>setPage("create")}>＋ 新しい小説を作る</button></main>}

  {page==="create"&&<main className="page"><PageTitle eyebrow="NEW NOVEL" title="小説を作る" sub="基本設定を入力して、作品を作成します。"/><form className="create-form" onSubmit={e=>{e.preventDefault();setMessage(book.public?"作品を公開する準備ができました。":"下書きを保存しました。");}}><label>タイトル<input value={book.title} onChange={e=>setBook({...book,title:e.target.value})} placeholder="作品タイトル"/></label><label>ジャンル<input value={book.genre} onChange={e=>setBook({...book,genre:e.target.value})} placeholder="SF、ファンタジー、ミステリーなど"/></label><label>あらすじ<textarea value={book.summary} onChange={e=>setBook({...book,summary:e.target.value})} placeholder="作品の概要"/></label><label>本文<textarea className="body-input" value={book.body} onChange={e=>setBook({...book,body:e.target.value})} placeholder="第1話の本文、またはAIに生成してほしい内容を入力"/></label><label className="check"><input type="checkbox" checked={book.public} onChange={e=>setBook({...book,public:e.target.checked})}/> 公開作品として投稿する</label>{message&&<div className="notice">{message}</div>}<div className="actions"><button type="button" className="secondary" onClick={()=>setPage("mypage")}>キャンセル</button><button className="primary" type="submit">{book.public?"公開する":"下書き保存"} →</button></div></form></main>}

  <footer><span>© Novel Development Center</span><span>AI Novel Creation & Publishing Platform</span></footer>
 </div>
}

function BookCard({book,onClick}){return <button className="book-card" onClick={onClick}><div className="cover"><span>{book.genre}</span><strong>{book.title}</strong></div><div className="book-meta"><b>{book.title}</b><span>by {book.author}</span><div>♥ {book.likes}　·　{book.views.toLocaleString()} views</div></div></button>}
function PageTitle({eyebrow,title,sub}){return <div className="page-title"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{sub}</p></div>}
export default App;
