import { useEffect, useState } from 'react';
import axios from 'axios';

const Example = () => {
  const url = "http://127.0.0.1:8000/contents";
  
  // 状態の宣言
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); // ローディング
  const [error, setError] = useState(null); // エラー
  const [val, setval] = useState(''); // エラー

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data); 
      } catch (err) {
        setError(err); 
            } finally {
        setLoading(false);       }
    };

    fetchData(); 
  }, [url]); 

  const createPost = async () => {
    try {
      if(val==''){
        return;
      }
      const newItem = { name: val};
      await axios.post(url, newItem);
      const response = await axios.get(url);
      setData(response.data); 
      setval('')

    } catch (err) {
      setError(err); 
    }
  };
  const deletePost = async (delete_name) => {
    try {
      await axios.delete(`${url}/${delete_name}`, delete_name);

            const response = await axios.get(url);
      setData(response.data); 
      setval('')

    } catch (err) {
      setError(err); 
        }
  };
  const  reset = async()=>{
    const response = await axios.get(url);
      setData(response.data); 
      setval('')
  }

  if (loading) return <p>読み込み中...</p>;

  if (error) return <p>エラーが発生しました: {error.message}</p>;

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
