"use client";
import { useState } from "react";
import { ApolloProvider, useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import { LOGIN_USER, REGISTER_USER } from "./graphql/mutations";
import { GET_POSTS, GET_PROFILE } from "./graphql/queries";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import AddPost from "./components/AddPost";
import GetPosts from "./components/GetPosts";
import GetPost from "./components/GetPost";
import DeletePost from "./components/DeletePost";
import UpdatePost from "./components/UpdatePost";
import Link from "next/link";
const client = new ApolloClient({
  link: new HttpLink({ uri: "/api/graphql" }),
  cache: new InMemoryCache(),
});

export default function Home() {
  const [userId, setUserId] = useState(0);
  const [userCreatedAt, setUserCreatedAt] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [RegisterUser] = useMutation(REGISTER_USER);
  const [LoginUser] = useMutation(LOGIN_USER);
  const {  refetch, loading, error} = useQuery(GET_PROFILE, {
    fetchPolicy: "network-only",
    skip: true
  });

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phoneNumber || !password) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const data = await RegisterUser({
        variables: {
          phone_number: phoneNumber,
          password
        }
      });
      if (data.error) {
        alert(data.error?.message);
      }
      alert("User registered successfully!");
      console.log(data);
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phoneNumber || !password) {
      alert("Please fill in all fileds");
      return;
    }
    try {
      const data = await LoginUser({
        variables: {
          phone_number: phoneNumber,
          password
        }
      });

      if (data.error) {
        alert(data.error.message);
        return;
      }
      alert("login with successfully");
      console.log(data);
    } catch(err) {
      console.error("مشکلی پیش آمد");
    }
  };

  const handleGetProfile = async () => {
    const data = await refetch() as { 
      data: { 
        profile: {
          id: number,
          phone_number: string,
          createdAt: string,
        }
      },
      error: {
        message: string,
      }
    };
    
    if (data.error) {
      alert(data.error?.message);
      return;
    }

    alert("*user*");
    setUserId(data.data.profile.id);
    setPhoneNumber(data.data.profile.phone_number);
    setUserCreatedAt(new Date(parseInt(data.data.profile.createdAt)).toString());
  }

  return (
    <ApolloProvider client={client}>
      <main>
        <h1>api test</h1>
        <form onSubmit={handleRegisterSubmit}>
          <h2>register test</h2>
          <input
            type="number"
            placeholder="Enter the Phone Number ..."
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} />
          <input
            type="password"
            placeholder="Enter your password ..."
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
        <form onSubmit={handleLoginSubmit}>
          <h2>login test</h2>
          <input 
            type="number"
            placeholder="Enter the Phone Number ..."
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)} />
          <input
            type="password"
            placeholder="Enter your password ..."
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
        <div>
          <h2>Get Profile</h2>
          <button onClick={handleGetProfile}>Get Profile</button>
          <p>id: {userId}</p>
          <p>phone_number: {phoneNumber}</p>
          <p>createdAt: {userCreatedAt}</p>
        </div>
        <AddPost />
        <DeletePost />
        <UpdatePost />
        <GetPost />
        <GetPosts query={GET_POSTS} outputType={"get_posts"} />
        <div style={{ marginTop: 20 }}>
          <h2>test get liked post api</h2>
          <Link className="link" href="/liked_posts">پست هایی پسندیده شده</Link>
        </div>

        <div style={{ marginTop: 20 }}>
          <h2>test get disliked post api</h2>
          <Link className="link" href="/disliked_posts">پست هایی که نپسندیده اید</Link>
        </div>

        <div style={{ marginTop: 20 }}>
          <h2>test get saved post</h2>
          <Link className="link" href="/saved_posts">پست هایی که ذخیره کرده اید</Link>
          
        </div>
        

      </main>
    </ApolloProvider>
  );
}
