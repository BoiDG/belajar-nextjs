// import { WithDefaultLayout } from '@/components/DefautLayout';
// import { Title } from '@/components/Title';
// import {  Restaurant } from '@/functions/swagger/BelajarNextJsBackEnd';
// import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
// import { Page } from '@/types/Page';
// import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Alert} from 'antd';
// import Link from 'next/link';
// import useSwr from 'swr';

// // C- Create
// // R- Read
// // U- Update
// // D- Delete

// const RestaurantTableRow: React.FC<{
//     restaurant: Restaurant
// }> = ({ restaurant }) => {



//     return (
//         <tr>
//             <td className="border px-4 py-2">{restaurant.name}</td>
//             <td className="border px-4 py-2">
//                 <Link href={`/restaurant/ItemList/${restaurant.id}`} className="inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
//                     <FontAwesomeIcon className='mr-1' icon={faArrowRight}></FontAwesomeIcon>
//                     Visit Restaurant
//                 </Link>
//             </td>
//         </tr>
//     );
// };

// const IndexPage: Page = () => {

//     const swrFetcher = useSwrFetcherWithAccessToken();
//     const { data, error } = useSwr<Restaurant[]>('/api/be/api/Restaurants', swrFetcher);

//     return (
//         <div>
//             <Title>List Restaurants</Title>
//             <h2 className='mb-5 text-3xl'>List Restaurants</h2>
//             <div>
//                 <Link href='/' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block'>
//                     <FontAwesomeIcon icon={faArrowLeft} className='mr-2'></FontAwesomeIcon>
//                     Ke Halaman Utama
//                 </Link>
//             </div>

//             {Boolean(error) && <Alert type='error' message='Cannot get restaurants data' description={String(error)}></Alert>}
//             <table className='table-auto mt-5'>
//                 <thead className='bg-slate-700 text-white'>
//                     <tr>
//                         <th className='px-4 py-2'>Name</th>
//                         <th className='px-4 py-2'>Go to restaurant</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data?.map((x, i) => <RestaurantTableRow key={i} restaurant={x} ></RestaurantTableRow>)}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// IndexPage.layout = WithDefaultLayout;
// export default IndexPage;
