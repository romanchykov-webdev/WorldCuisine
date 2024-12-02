import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {useRouter} from "expo-router";
import ButtonBack from "../components/ButtonBack";

import {Image} from 'expo-image'
import {wp} from "../constants/responsiveScreen";
import {shadowBoxBlack} from "../constants/shadow";


import {
    PencilSquareIcon,
    ArrowLeftEndOnRectangleIcon,
    CreditCardIcon,
    StarIcon,
    HeartIcon,
    BellIcon
} from "react-native-heroicons/mini";
import {supabase} from "../constants/supabase";

const ProfileScreen = () => {

    const router = useRouter();

    // change avatar
    const changeAvatar = async () => {
        console.log('changeAvatar')
    }

    // log out
    const handleLogUot = () => {
        console.log('log out')
    }

    // handleMyPost
    // слушатель создания нового заказа

    // слушатель создания нового заказа
    // update
    // const { data, error } = await supabase
    //     .from('orders')
    //     .update({ price: 200 })
    //     .eq('id', '56f372ef-f3b0-4769-993c-1f3426e42c6e')
    // create order
    const creatOrd = async () => {
        console.log('creat')
        try {
            const {data, error} = await supabase
                .from('orders')
                // .select('*')
                // .eq('client_id','b766c17d-859a-4635-91f0-d4151c608237')
                .insert([{
                    address: 'address',
                    zip_code: '001',
                    city: 'NEWcity',
                    name: 'NEWName',
                    client_id: 'b4e9e606-52ee-47eb-9fe5-19bdc72f7889',
                    price: 3333
                }])

            // if(data){
            console.log('data create', data)
            // }
            if (error) {
                console.log('error', error)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const creteOrder = async () => {
       await creatOrd()
    }
    // create order

    const [orders, setOrders] = useState([])
    const fetchOrders = async () => {
        try {
            let {data: orders, error} = await supabase
                .from('orders')
                // .select('address,city,name,id,price')
                // .eq('city', 'Torre di mosto');
                .select('*')
            // .eq('client_id','3235b4fe-7e85-42f1-8124-7158d78d2fdc')
            // .eq('name','Sania')


            if (orders) {
                setOrders(orders);
                // console.log(JSON.stringify(orders,null, 2));
            }
        } catch (err) {
            console.log(err)

        }
    }

    // subscribe event new  order
    const channel = supabase
        .channel('event_create_new_order')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'orders'
            },
            (event) => {
                // console.log('subscribe',event)
                const {new: newOrder} = event;

                orders.value=orders.value.map(order => {
                    if(order.id === newOrder.id){
                        return{
                            ...order,
                            ...newOrder
                        }
                    }
                    return order;
                });
            }
        )
        .subscribe()
    // subscribe event new  order
    fetchOrders()

    const handleMyPost = () => {
        console.log('handleMyPost')
        fetchOrders()

    }

    // handleMyFavorite
    const handleMyFavorite = () => {
        console.log('handleMyFavorite')
    }

    return (
        <SafeAreaView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 20}}
            >
                <View className="flex-row justify-between items-center">
                    <View style={shadowBoxBlack()}>

                        <ButtonBack/>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogUot}
                        style={shadowBoxBlack()}
                        className="bg-white p-3 border-[1px] border-neutral-300 rounded-full"
                    >
                        <ArrowLeftEndOnRectangleIcon size={30} color="red"/>
                    </TouchableOpacity>
                </View>


                {/*    avatar and user name*/}
                <View className=" gap-y-5 items-center mb-5">

                    {/*avatar*/}
                    <View className="relative">
                        <View style={shadowBoxBlack()}>
                            <Image
                                source={require('../assets/img/user_icon.png')}
                                style={{width: wp(50), height: wp(50), borderRadius: '50%', marginBottom: 10}}
                                contentFit="cover"
                                transition={1000}
                                // onLoad={loadingImage}
                            />
                        </View>
                        <View className="absolute bottom-10 right-5" style={shadowBoxBlack()}>
                            <TouchableOpacity
                                onPress={changeAvatar}
                                className="bg-white p-2 border-[1px] border-neutral-300 rounded-full"
                            >

                                <PencilSquareIcon size={30} color='grey'/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/*userName*/}
                    <Text>user name</Text>
                </View>

                {/*change lang app*/}
                <View className="flex-row items-center mb-10">
                    <TouchableOpacity
                        onPress={() => router.push('/ChangeLangScreen')}
                        style={shadowBoxBlack()}
                        className="p-5 items-center justify-center flex-row w-full border-[1px] border-neutral-300 rounded-full bg-amber-300"
                    >
                        <Text>Change language App</Text>
                    </TouchableOpacity>
                </View>

                {/*   update profile   may posts may like  may rating*/}
                <View className="flex-row mb-5 items-center justify-around">

                    {/*may posts*/}
                    <TouchableOpacity
                        onPress={handleMyPost}
                        style={shadowBoxBlack()}
                        className="items-center p-2 bg-neutral-200 rounded-[15]"
                    >
                        <CreditCardIcon size={45} color='green'/>
                        <Text style={{fontSize: 8}}>May recipes</Text>
                    </TouchableOpacity>

                    {/*may favorite*/}
                    <TouchableOpacity
                        onPress={handleMyFavorite}
                        style={shadowBoxBlack()}
                        className="items-center p-2 bg-neutral-200 rounded-[15]"
                    >
                        <BellIcon size={45} color='gold'/>
                        <Text style={{fontSize: 8}}>May Favorite</Text>
                    </TouchableOpacity>

                    {/*may Favorite*/}
                    <TouchableOpacity
                        onPress={handleMyFavorite}
                        style={shadowBoxBlack()}
                        className="items-center p-2 bg-neutral-200 rounded-[15]"
                    >
                        <HeartIcon size={45} color='red'/>
                        <Text style={{fontSize: 8}}>May Favorite</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={creteOrder}
                    >
                        <Text>create order</Text>
                    </TouchableOpacity>
                </View>

                {/*    temp*/}
                <View>
                    {
                        orders?.map((order) => {
                            return (
                                <View key={order.id} className="flex-row">
                                    <Text>{order.address} : </Text>
                                    <Text>{order.city} : </Text>
                                    <Text>{order.name} : </Text>
                                    <Text>{order.price} : </Text>
                                </View>
                            )
                        })
                    }
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({})

export default ProfileScreen;
