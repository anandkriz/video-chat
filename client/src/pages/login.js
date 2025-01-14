import { useState } from 'react'
import { Link } from 'react-router-dom';
import '../styles.css';
export default function LoginPage() {

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const handleChange=(value,key)=>{
    setData({...data,[key]:value.value})
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", data);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 max-w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={(e)=>handleChange(e.target,'email')}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={data.password}
              onChange={(e)=>handleChange(e.target,'password')}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Log in
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link className="font-medium text-blue-600 hover:underline" to='/signup'>Sign up
          </Link>
        </p>
        <Link to='/chat/1124'> 
                 <span style={{ marginRight: "8px" }}>🐦</span>user1
              </Link> 
              <Link to='/chat/7665'> 
                <span style={{ marginRight: "8px" }}>🐦</span>user2
              </Link> 
      </div>
    </div>
  )
}