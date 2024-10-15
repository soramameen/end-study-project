import { useEffect, useState } from 'react';
import axios from 'axios';

const Example = () => {
  const url = "http://127.0.0.1:8000/contents";
  
  // 状態の宣言
  const [data, setData] = useState([]); // 初期状態を空の配列に設定
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(null); // エラー状態
  const [val, setval] = useState(''); // エラー状態

  useEffect(() => {
    // データ取得関数の定義
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data); // データを状態にセット
      } catch (err) {
        setError(err); // エラーを状態にセット
      } finally {
        setLoading(false); // ローディング状態を終了
      }
    };

    fetchData(); // データ取得の実行
  }, [url]); // urlが変更された場合に再実行

  const createPost = async () => {
    try {
      if(val==''){
        return;
      }
      const newItem = { name: val};
      await axios.post(url, newItem);
      // POST後に最新のデータを再取得
      const response = await axios.get(url);
      setData(response.data); // 更新されたデータを状態にセット
      setval('')

    } catch (err) {
      setError(err); // エラーを状態にセット
    }
  };
  const deletePost = async (delete_name) => {
    try {
      await axios.delete(`${url}/${delete_name}`, delete_name);

      // POST後に最新のデータを再取得
      const response = await axios.get(url);
      setData(response.data); // 更新されたデータを状態にセット
      setval('')

    } catch (err) {
      setError(err); // エラーを状態にセット
    }
  };
  const  reset = async()=>{
    const response = await axios.get(url);
      setData(response.data); // 更新されたデータを状態にセット
      setval('')
  }

  // ローディング中の表示
  if (loading) return <p>読み込み中...</p>;

  // エラーが発生した場合の表示
  if (error) return <p>エラーが発生しました: {error.message}</p>;

  // データが存在しない場合の表示
  if (!data || data.length === 0) return (<>
  <p>データがありません。</p>
  <input type="text" value={val} onChange={(e)=>{
        setval(e.target.value);
        console.log({val})
      }}/>
  <button onClick={createPost}>CreatePost</button>
  <button onClick={reset}>更新</button>


  </>);

  console.log(data);
  
  // データが存在する場合の表示
  return (
    <>
      <h2>アイテム一覧</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name} <button onClick={()=>{deletePost(item.name)}}> 実行済み </button></li>
        ))}
      </ul>
      <input type="text" value={val} onChange={(e)=>{
        setval(e.target.value);
        console.log({val})
      }}/>
      <button onClick={createPost}>CreatePost</button>
      <button onClick={reset}>更新</button>

    </>
  );
};

export default Example;
