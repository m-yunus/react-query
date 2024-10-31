import logo from './logo.svg';
import './App.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const queryclient = useQueryClient();
  const [page, setPage] = useState(1);
  const pageSize = 10; // Number of items per page

  const { data: tododata, error, isLoading } = useQuery({
    queryKey: ["todos", page],
    keepPreviousData: true,
    queryFn: async () => {
      const res = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageSize}`);
      return res.data;
    },
  });

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (newpost) =>
      axios.post("https://jsonplaceholder.typicode.com/posts", newpost, {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }),
    onSuccess: () => {
      // Invalidate and refetch
      queryclient.invalidateQueries(["todos"]);
    }
  });

  console.log(tododata);
  if (error || isError) {
    console.log(error);
  }
  if (isLoading) {
    return <div>data is loading</div>
  }

  return (
    <>
      <button onClick={() => mutate({
        userId: 5000,
        id: 4000,
        title: "new post",
        body: "new post body"
      })}>Add Post</button>
      {isPending && <p>Data is being added</p>}
      {
        isLoading ? <> <div>data is loading </div></> :
          tododata?.map((item, i) => (
            <div key={i}>
              <p>{item.title}</p>
              <p>{item.id}</p>
              <p>{item.body}</p>
            </div>
          ))
      }
      <div>
        <button onClick={() => setPage((old) => Math.max(old - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span> Page {page} </span>
        <button onClick={() => setPage((old) => old + 1)}>
          Next
        </button>
      </div>
    </>
  );
}

export default App;
