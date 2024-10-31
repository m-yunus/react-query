import logo from './logo.svg';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function App() {

const { data:tododata,error,isLoading } = useQuery({
  queryKey: ["todos"],
  queryFn: async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
    return res.data; // Ensure a value is returned
  }
});
console.log(tododata);
if(error){
  console.log(error);
  
}
if (isLoading){
  return <div>data is loading</div>
  
}
  // https://jsonplaceholder.typicode.com/todos/1
  return (
    <>
    {
      isLoading ? <> <div>data is loading </div></>:
      tododata?.map((item,i)=>(
        <>
        <div key={i}>{item.title}</div>
        </>
      ))
    }
    
    </>
  );
}

export default App;
