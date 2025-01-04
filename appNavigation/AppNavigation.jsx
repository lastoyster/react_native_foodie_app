import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { Button, StyleSheet, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

import Cart from "../src/screens/home/Cart";
import Profile from "../src/screens/home/Profile";
import Splash from "../src/screens/onboard/Splash";
import Dashboard from "../src/screens/home/Dashboard";
import Login from "../src/screens/auth/Login";
import SignUp from "../src/screens/auth/SignUp";
import OnboardingScreen from "../src/screens/onboard/OnboardingScreen";
import Search from "../src/screens/home/Search";
import ProductDetails from "../src/screens/nested/dashboard/ProductDetails";
import Discount from "../src/screens/nested/dashboard/Discount";
import OrderDetails from "../src/screens/nested/dashboard/OrderDetails";
import { myTheme } from "../src/utils/Theme";
import Checkout from "../src/screens/nested/cart/Checkout";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/UserSlice";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Payment from "../src/screens/nested/cart/Payment";
import Successful from "../src/screens/nested/cart/Successful";
import Favorites from "../src/screens/nested/profile/Favorites";


const AuthStack = createNativeStackNavigator();

const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Splash" component={Splash} />
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="SignUp" component={SignUp} />
    </AuthStack.Navigator>
  );
};

const RootTab = createBottomTabNavigator();

export default function AppNavigation() {
  const navigation = useNavigation();

  //Home stack
  const HomeStack = createNativeStackNavigator();

  const HomeStackScreen = () => {
    return (
      <HomeStack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <HomeStack.Screen name="Splash" component={Splash} />
        <HomeStack.Screen name="Dashboard" component={Dashboard} />
        <HomeStack.Screen name="Details" component={ProductDetails} />
        <HomeStack.Screen name="OrderDetails" component={OrderDetails} />
        <HomeStack.Screen name="Discount" component={Discount} />
        {/* <HomeStack.Screen name="Location" component={LocationSearch} options={{
          title: "Location",
          presentation: "fullScreenModal",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.iconBg}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeftIcon size="20" strokeWidth={2} color="white" />
            </TouchableOpacity>
          ),
        }} /> */}

      </HomeStack.Navigator>
    );
  };

  // CART STACK
  const CartStack = createNativeStackNavigator();

  const CartStackScreen = () => {
    return (
      <CartStack.Navigator initialRouteName="Cart">
        <CartStack.Screen
          name="Cart"
          component={Cart}
          options={{
            title: "Cart",
            headerLeft: () => (
              <TouchableOpacity
                style={styles.iconBg}
                onPress={() => navigation.goBack()}
              >
                <ChevronLeftIcon size="20" strokeWidth={2.1} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <CartStack.Screen
          name="Checkout"
          component={Checkout}
          options={{
            title: "Order Confirmation",
            headerLeft: () => (
              <TouchableOpacity
                style={styles.iconBg}
                onPress={() => navigation.goBack()}
              >
                <ChevronLeftIcon size="20" strokeWidth={2.1} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <CartStack.Screen
          name="Payment"
          component={Payment}
          options={{
            title: "Payment Method",
            headerLeft: () => (
              <TouchableOpacity
                style={styles.iconBg}
                onPress={() => navigation.goBack()}
              >
                <ChevronLeftIcon size="20" strokeWidth={2.1} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <CartStack.Screen
          name="Successful"
          component={Successful}
          options={{
            headerShown: false,
          }}
        />
      </CartStack.Navigator>
    );
  };


  // PROFILE STACK
  const ProfileStack = createNativeStackNavigator();

  const ProfileStackScreen = () => {
    return (
      <ProfileStack.Navigator
        initialRouteName="Profile">
        <ProfileStack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerShown: false,
          }}
        />
        <ProfileStack.Screen
          name="Favorites"
          component={Favorites}
          options={{
            title: "Favorite stores",
            headerLeft: () => (
              <TouchableOpacity
                style={styles.iconBg}
                onPress={() => navigation.goBack()}
              >
                <ChevronLeftIcon size="20" strokeWidth={2.1} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
      </ProfileStack.Navigator>
    );
  };

  // Getting the current user state(logged in or not)
  const user = useSelector((state) => state.user.user);
  console.log("userstate", user);
  const dispatch = useDispatch();

  // Setting the userState to control the displayed stack
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(true));
      } else {
        return;
      }
    });

    return unSubscribe;
  }, []);

  // Setting cart badge
  const cart = useSelector((state) => state.cart.cart);

  // Hiding the tab bar on specific screens
  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";

    if (
      routeName === "Details" ||
      routeName === "OrderDetails" ||
      routeName === "Splash" ||
      routeName === "Discount" ||
      routeName === "Favorites" ||
      routeName === "Checkout"
    ) {
      return "none";
    } else {
      return "flex";
    }
  };

  const renderContent = () => {
    if (user === true) {
      return (
        <RootTab.Navigator
          initialRouteName="HomeStack"
          screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: { backgroundColor: myTheme.primary },
            tabBarInactiveTintColor: myTheme.fade,
            tabBarActiveTintColor: myTheme.secondary,
          }}
        >
          <RootTab.Screen
            name="HomeStack"
            component={HomeStackScreen}
            options={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                display: getTabBarVisibility(route),
                backgroundColor: myTheme.primary,
              },
              tabBarIcon: ({ color, size }) => {
                return <Ionicons name="home" size={size} color={color} />;
              },
            })}
          />
          <RootTab.Screen
            name="Search"
            component={Search}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                return <FontAwesome name="search" size={size} color={color} />;
              },
            }}
          />
          <RootTab.Screen
            name="CartStack"
            component={CartStackScreen}
            options={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                display: getTabBarVisibility(route),
                backgroundColor: myTheme.primary,
              },
              tabBarBadge: cart.length,
              tabBarBadgeStyle: {
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
                fontWeight: "bold",
              },
              tabBarIcon: ({ color, size }) => {
                return (
                  <FontAwesome name="shopping-cart" size={size} color={color} />
                );
              },
            })}
          />
          <RootTab.Screen
            name="ProfleStack"
            component={ProfileStackScreen}
            options={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                display: getTabBarVisibility(route),
                backgroundColor: myTheme.primary,
              },
              tabBarIcon: ({ color, size }) => {
                return <Ionicons name="home" size={size} color={color} />;
              },
            })}
          />
        </RootTab.Navigator>
      );
    }

    return <AuthStackScreen />;
  };

  return (
    <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconBg: {
    padding: 3,
    marginRight: 10,
    borderRadius: 40,
    backgroundColor: myTheme.tertiary,
  },
});
