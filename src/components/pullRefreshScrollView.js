'use strict';

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator, Dimensions,
} from 'react-native';

// import screnInfo from '../utils/View';
import PropTypes from 'prop-types';

/**
 * 使用方法
 *
 *
 */

export default class PullAndLoadScreen extends Component {
    static defaultProps = {
        data: [],
        ItemSeparatorComponent: () => {
            return <View style={styles.baseLine} />
        },
        ListEmptyComponent: () => {
            return (
                <View style={styles.noListView}>
                    <Text style={styles.NoListText}>这里空空如也~</Text>
                </View>
            );
        },
        refreshing: false,
        animating: true,
        ItmeHeight: 50,


    };
    static propTypes = {
        data: PropTypes.array,
        keyExtractor: PropTypes.func,
        onEndReached: PropTypes.func,
        renderItem: PropTypes.func,
        ItemSeparatorComponent: PropTypes.func,
        ListEmptyComponent: PropTypes.func,
        ListFooterComponent: PropTypes.func,
        refreshing: PropTypes.bool,
        colors: PropTypes.array,
        progressBackgroundColor: PropTypes.string,
        onRefresh: PropTypes.func,
        animating: PropTypes.bool,
        nomore: PropTypes.bool,
        ItmeHeight: PropTypes.number,

    };


    constructor(props) {
        super(props);
    }
    _ListFooterComponent = () => {
        const { data, nomore, animating } = this.props;
        return (
            <View style={styles.bottomfoot}>
                {
                    data.length != 0 ?
                        nomore ? (
                            <Text style={styles.footText}>- 我是有底线的 -</Text>
                        ) : (
                            <View style={styles.activeLoad}>
                                <ActivityIndicator size="small" animating={animating} />
                                <Text style={[styles.footText, styles.ml]}>加载更多...</Text>
                            </View>
                        )
                        :
                        null
                }

            </View>
        );
    };
    _renderItem = (item) => {
        return  this.props.renderItem(item);
    }

    render() {
        const {
            data,
            keyExtractor,
            onEndReached,
            ItemSeparatorComponent,
            ListEmptyComponent,
            refreshing,
            colors,
            progressBackgroundColor,
            onRefresh,
        } = this.props;
        console.log(data)
        return (

            <FlatList
                data={data}
                keyExtractor={keyExtractor}
                onEndReached={onEndReached}
                refreshing={true}
                renderItem={({ item }) => this._renderItem(item)}
                ItemSeparatorComponent={ItemSeparatorComponent}
                ListEmptyComponent={ListEmptyComponent}
                ListFooterComponent={this._ListFooterComponent}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        colors={colors}
                        progressBackgroundColor={progressBackgroundColor}
                        onRefresh={onRefresh}
                    />
                }
            />

        );
    }
}
const {width, height, scale} = Dimensions.get('window');

const styles = StyleSheet.create({
    baseLine: {
        width: width,
        height: 1,
        backgroundColor: '#eeeeee',
    },
    noListView: {
        width: width,
        height: height - 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    NoListText: {
        marginTop: 15,
        fontSize: 18,
        color: '#999999',
    },
    bottomfoot: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    footText: {
        marginTop: 5,
        fontSize: 12,
        color: '#999999',
    },
    activeLoad: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ml: {
        marginLeft: 10,
    },
});
