import axios from 'axios';

const instance = axios.create({
  baseURL: `http://localhost:4000/`,
});

// 在header 寫好了
// const deleteClear = async () => {
//   const { data: { msg } } = await instance.post('/start')
//   return msg
// }



export default instance;

// instance.get('/hi').then((data) => console.log(data));
