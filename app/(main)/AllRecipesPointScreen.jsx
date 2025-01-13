import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {useLocalSearchParams} from "expo-router";
import {getAllRecipesPointMasonryMyDB} from "../../service/getDataFromDB";

const AllRecipesPointScreen = () => {

    const {point} = useLocalSearchParams();

    const [allRecipes, setAllRecipes] = useState([])

    console.log('AllRecipesPointScreen',point)

    const fetchGetAllRecipesPointMasonryMyDB=async ()=>{
        const res =  await getAllRecipesPointMasonryMyDB(point)
        console.log('AllRecipesPointScreen res point',res.data)
        // setAllRecipes(res)
    }

    useEffect(() => {
        fetchGetAllRecipesPointMasonryMyDB()
    }, [point]);

    return (
        <SafeAreaView>
            <Text>AllRecipesPointComponent</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({});

export default AllRecipesPointScreen;