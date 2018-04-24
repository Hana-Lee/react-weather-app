import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Weather from './Weather';

export default class App extends Component {
	state = {
		isLoaded: false
	};

	positionHandler(position) {
		//state.isLoaded = true;
		this.setState({
			isLoaded: true
		});
	}
	getPosition() {
		this.useGetCurrentPositionFn(this.positionHandler);
	}
	useGetCurrentPositionFn(successHandler) {
		navigator.geolocation.getCurrentPosition(
			position => {
				console.log('get current position', position);
				// successHandler(position).bind(this);
				this.setState({
					isLoaded: true
				});
				// this.useWatchPositionFn(successHandler);
			},
			error => {
				console.error('get current position error', JSON.stringify(error));
				this.useWatchPositionFn(successHandler);
			},
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000,
				distanceFilter: 10
			}
		);
	}
	useWatchPositionFn(successHandler) {
		var watchId = navigator.geolocation.watchPosition(
			position => {
				console.log('watch position', position);
				this.setState({
					isLoaded: true
				});
				navigator.geolocation.clearWatch(watchId);
			},
			error => {
				console.error('watch position error', JSON.stringify(error));
				navigator.geolocation.clearWatch(watchId);
			},
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000,
				distanceFilter: 10
			}
		);
	}
	componentDidMount() {
		console.log('componentDidMount');
		this.getPosition();
	}

	render() {
		const { isLoaded } = this.state;
		return (
			<View style={styles.container}>
				{isLoaded ? (
					<Weather />
				) : (
					<View style={styles.loading}>
						<Text style={styles.loadingText}>
							Getting the weather informations...
						</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		flexWrap: 'wrap'
	},
	loading: {
		flex: 1,
		backgroundColor: '#FDF6AA',
		justifyContent: 'flex-end',
		paddingLeft: 25,
		paddingRight: 25
	},
	loadingText: {
		fontSize: 38,
		marginBottom: 24
	}
});
