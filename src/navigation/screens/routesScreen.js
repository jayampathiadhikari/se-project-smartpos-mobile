import React,{Component} from 'react';
import {Button} from 'react-native';


export default class RoutesScreen extends React.Component {

const initialArr = [{
    color: "blue",
    text: "text1"
}, {
    color: "red",
    text: "text2"
}];

renderButtons() {
    return initialArr.map((item) => {
        return (
            <Button
                style={{ borderColor: item.color }}
                onPress={this.onPress}
            >
                {item.text}
            </Button>
        );
    });
}

 render() {
    return (
//        <View style={styles.container}>
//          <Text>Routes Screen</Text>
//        </View>
            <View >
                        {
                            this.renderButtons()
                        }
                    </View>
    );
  }
}