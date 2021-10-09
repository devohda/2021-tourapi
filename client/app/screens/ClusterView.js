import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import MapView, { Marker, Callout} from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';
import { COORDS, INITIAL_POSITION } from "./Data";

const INIT_REGION = {
  latitude: 41.8962667,
  longitude: 11.3340056,
  latitudeDelta: 12,
  longitudeDelta: 12
}

export default class MyClusteredMapView extends Component {

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
          coordinate = cluster.coordinate,
          clusterId = cluster.clusterId

    // use pointCount to calculate cluster size scaling
    // and apply it to "style" prop below

    // eventually get clustered points by using
    // underlying SuperCluster instance
    // Methods ref: https://github.com/mapbox/supercluster
    const clusteringEngine = this.map.getClusteringEngine(),
          clusteredPoints = clusteringEngine.getLeaves(clusterId, 100)

    return (
      <Marker coordinate={coordinate} >
        <View style={styles.myClusterStyle}>
          <AppText style={styles.myClusterTextStyle}>
            {pointCount}
          </AppText>
        </View>
        {
          /*
            Eventually use <Callout /> to
            show clustered point thumbs, i.e.:
            <Callout>
              <ScrollView>
                {
                  clusteredPoints.map(p => (
                    <Image source={p.image}>
                  ))
                }
              </ScrollView>
            </Callout>

            IMPORTANT: be aware that Marker's onPress event isn't really consistent when using Callout.
           */
        }
      </Marker>
    )
  }

  renderMarker = (data) => <Marker key={data.id || Math.random()} coordinate={data.location} />

  render() {
    return (
      <ClusteredMapView
        style={{flex: 1, height: 200}}
        data={COORDS}
        initialRegion={INITIAL_POSITION}
        ref={(r) => { this.map = r }}
        renderMarker={this.renderMarker}
        renderCluster={this.renderCluster} />
    )
  }
};

const styles = StyleSheet.create({
    myClusterStyle: {
        borderRadius: 50,
        backgroundColor: '#fff'
    },
    myClusterTextStyle: {
    },
});