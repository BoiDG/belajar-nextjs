import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { Authorize } from '@/components/Authorize';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSwr from 'swr';
import {  FoodItemDataGridItem } from '@/functions/swagger/BelajarNextJsBackEnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft,  faCashRegister } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';



const FoodItemDisplayItem: React.FC<{
    foodItem: FoodItemDataGridItem
}> = ({ foodItem }) => {

    return (
        <a href={`/addToCart/add-to-cart/${foodItem.id}`} className='border border-gray-400 rounded-xl p-6 flex flex-col items-center bg-white shadow-lg'>
            <div className='bg-slate-400 h-[160px] w-full'></div>
            <div className='mt-4 font-bold'>{foodItem.name}</div>
            <div className='mt-4'>{'Rp.' + foodItem.price?.toLocaleString()}</div>
            <div className='mt-4 w-full flex'></div>
        </a>
    );
};

const InnerIndexPage: React.FC = () => {

    const fetcher = useSwrFetcherWithAccessToken();
    const { data } = useSwr<FoodItemDataGridItem[]>('/api/be/api/FoodItems', fetcher);

 

    return (
        <div>
            <Title>Menu</Title>
            <h2 className='mb-5 text-3xl'>Menu</h2>
            <div>
                <Link href='/' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block'>
                    <FontAwesomeIcon icon={faArrowLeft} className='mr-2'></FontAwesomeIcon>
                    Ke Halaman Utama
                </Link>
            </div>

            <div>
                <Link href='/' className='bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block mt-5'>
                    <FontAwesomeIcon icon={faCashRegister} className='mr-2'></FontAwesomeIcon>
                    CheckOut
                </Link>
            </div>
            <div className='grid grid-cols-5 gap-5 mt-5'>
                {data?.map((x, i) => <FoodItemDisplayItem  key={i} foodItem={x} />)}
            </div>
            
        </div>
    );
}

const IndexPage: Page = () => {

 

    return (
        <Authorize>
            <InnerIndexPage></InnerIndexPage>
        </Authorize>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;