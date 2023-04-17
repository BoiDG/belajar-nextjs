import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { z } from 'zod';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { BelajarNextJsBackEndClient, FoodItemDetailModel, Restaurant } from '@/functions/swagger/BelajarNextJsBackEnd';
import Link from 'next/link';
import { InputText } from '@/components/FormControl';
import { Select,  notification } from 'antd';
import { useState } from 'react';
import useSwr from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import { useAuthorizationContext } from '@/functions/AuthorizationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

// C- Create
// R- Read
// U- Update
// D- Delete

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    }),
    price: z.number({
        invalid_type_error:'Harga tidak boleh kosong dan harus angka'
    }).nonnegative({
        message:'Harga tidak boleh negatif'
    })
        .max(100000000, "Harga tidak dapat lebih dari 100 juta rupiah")
        .min(100, "Angka tidak dapat kurang dari 100 rupiah"),
    restaurantId: z.string({
        required_error:'restaurant tidak boleh kosong'
    }).nonempty({
        message: 'restaurant tidak boleh kosong'
    }),
});

type FormDataType = z.infer<typeof FormSchema>;

const EditForm: React.FC<{
    id: string,
    foodItem: FoodItemDetailModel,
}> = ({ id, foodItem }) => {

    const {
        register,
        formState: { errors },
        control
    } = useForm<FormDataType>({
        defaultValues: {
            name: foodItem.name,
            price: foodItem.price,
            restaurantId:foodItem.restaurantId,
        },
        resolver: zodResolver(FormSchema)
    });

    const [qty, setQty] = useState(1);

    const { accessToken } = useAuthorizationContext();

    async function addToCart() {
        const client = new BelajarNextJsBackEndClient('http://localhost:3000/api/be', {
            fetch(url, init) {
                if (init && init.headers){
                    init.headers['Authorization'] = `Bearer ${accessToken}`
                }
                return fetch(url, init);
            }
        });
        try {
            await client.addToCart({
                foodItemId: foodItem.id,
                qty: qty
            });
            notification.success({
                type: 'success',
                placement: 'bottomRight',
                message: 'Added to cart',
                description: `Added ${qty} ${foodItem.name} to cart`
            });
        } catch (err) {
            notification.error({
                type: 'error',
                placement: 'bottomRight',
                message: 'Failed to add to cart',
                description: String(err)
            });
        }
    }

    const [search, setSearch] = useState('');
    const params = new URLSearchParams();
    params.append('search', search);
    const restaurantsUri = '/api/be/api/Restaurants?' + params.toString();
    const fetcher = useSwrFetcherWithAccessToken();
    const { data } = useSwr<Restaurant[]>(restaurantsUri, fetcher);

    const setSearchDebounced = debounce((t: string) => setSearch(t), 300);

    const options = data?.map(Q => {
        return {
            label: Q.name,
            value: Q.id
        };
    }) ?? [{
        label: foodItem.restaurantName,
        value: foodItem.restaurantId
    }];

    return (
        <div >
            <div>
                    <label htmlFor='name'>Name</label>
                    <InputText id='name' {...register('name')} disabled></InputText>
                    <p className='text-red-500'>{errors['name']?.message}</p>
                </div>
                <div>
                    <label htmlFor='price'>Price</label>
                    <InputText id='price'{...register('price', { valueAsNumber: true })} disabled></InputText>
                    <p className='text-red-500'>{errors['price']?.message}</p>
                </div>
                <div className='mt-5'>
                    <label htmlFor='restaurant'>Restaurant</label>
                    <Controller 
                        control={control}
                        name='restaurantId'
                        render={({ field }) => (
                            <Select
                                className='block'
                                {...field}
                                onSearch={t => setSearchDebounced(t)}
                                options={options}
                                disabled
                            />
                        )}
                ></Controller>

                <p className='text-red-500'>{errors['restaurantId']?.message}</p>
            </div>

            <div className='flex-[1] mt-5'>
                    <input value={qty} type='number' onChange={t => setQty(t.target.valueAsNumber)}
                        className='block w-full p-1 text-sm rounded-md border-gray-500 border-solid border'></input>
            </div>

            <div className='flex-[3] pl-2 mt-5'>
                    <button onClick={addToCart} className='block w-full p-1 text-sm rounded-md bg-blue-500 active:bg-blue-700 text-white' type='button'>
                        <FontAwesomeIcon icon={faCartPlus} className='mr-3'></FontAwesomeIcon>
                        Add to cart
                    </button>
                </div>
        </div>
    );
};

const IndexPage: Page = () => {

    const router = useRouter();
    const { id } = router.query;
    const foodItemDetailUri = id ? `/api/be/api/FoodItems/${id}` : undefined;
    const fetcher = useSwrFetcherWithAccessToken();
    const { data } = useSwr<FoodItemDetailModel>(foodItemDetailUri, fetcher);

    function renderForm() {
        if (!id || !data || typeof id !== 'string') {
            return;
        }

        return (
            <EditForm id={id} foodItem={data} ></EditForm>
        );
    }

    return (
        <div>
            <Title>Add Item To Cart</Title>
            <Link href='/'>Return to Restaurant List</Link>

            <h2 className='mb-5 text-3xl'>Add Item To Cart</h2>
            {renderForm()}
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;
