import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function LoginNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Notifications" component={Main} />
        </Stack.Navigator>
    );
}

export default LoginNavigator;