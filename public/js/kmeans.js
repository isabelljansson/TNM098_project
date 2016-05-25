    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   var keys = [];
   var clusters = [];
   var centroids = [];
   var EPSILON = 0.005;
   
    function kmeans(kdata, k) {	
    	// id, hazium, times
		var iteration = 0;
		var qualityDiff = 100000;

		// 0. Convert data
		kdata = convertData(kdata);
		keys = d3.keys(kdata[0]);
		
		// 1. Randomise k positions
		createCentroids(kdata, keys, k);
		
		do {
			// 2. Assign item to closest centroid
			kdata.forEach(function(d, i) { clusters[i] = assign(d, keys); });
			
			// 3. Reassign centroids
			reassign(kdata);
			
			// 4. Check quality
			//console.log("Quality: " + qualityDiff);
			var temp = qualityDifference(kdata);
			if (qualityDiff - EPSILON > temp)
				qualityDiff = temp;
			else 
				qualityDiff = 0;
			
			iteration++;

		} while( iteration < 20 && qualityDiff !== 0 );
		
		// 5. Reorder cluster to be 0 = dead, the higher the more safe.
		var total = [];
		for(j = 0; j < centroids.length; j++) {
			var sum = [];
			total.push({"hazium": 0, "times": 0, "id": j});
			keys.forEach(function(p) { sum[p] = 0; });
			var counter = 0;
			// Go through all kdata and check if its assigned to clusters j
			kdata.forEach(function(d, i) {
				if (clusters[i] == j) {
					// Add up 'hazium' and 'times' coordinates to calculate avg value
					keys.forEach(function(p) { sum[p] += Number(d[p]); });
					counter++;
				}
			});

			// Calculate each clusters average
			if (counter !== 0) {
				keys.forEach(function(p) { total[j][p] += sum[p] / counter; });
			}
		}
		// Sort the clusters id
		total.sort(sortCluster);
		var sortedClusters = [];
		for (j = 0; j < centroids.length; ++j) {
			clusters.forEach(function(d, i) {
				if (clusters[i] == j)
					sortedClusters[i] = find(total, clusters[i]);
			});
		}

		// 6. Return an array of assignments for color coding
		return sortedClusters;
    };


	function sortCluster(element1, element2) {
	    return ( element2.hazium * element2.times ) - ( element1.hazium * element1.times );
	}
	
	function convertData(kdata) {
		var temp = [];
		for (var i = 0; i < kdata.length; ++i) {
			temp.push( { "hazium": kdata[i].hazium, "times": kdata[i].times } );
		}
		return temp;
	}
	
	function createCentroids(kdata, keys, k) {
		for(i = 0; i < k; i++)
			centroids[i] = kdata[Math.floor(Math.random()*kdata.length)];
	}
	
	// Calculate the euclidian distance between dataItem and centroid
	function assign(kdata, keys) {
		var dist = 10000;
		var k = -1;
		for (i = 0; i < centroids.length; i++) {
			var sum = 0;
			keys.forEach( function(d) { sum += Math.pow(Number(centroids[i][d]) - Number(kdata[d]),2); });
			var distance = Math.sqrt(sum);
			
			if (dist > distance) {
				dist = distance;
				k = i;
			}
		}
		return k; 
	};
	
	function reassign(kdata) {
		// Go through all clusters
		for(j = 0; j < centroids.length; j++) {
			var sum = [];
			keys.forEach(function(p) { sum[p] = 0; });
			var counter = 0;
			// Go through all data and check if its assigned to clusters j
			kdata.forEach(function(d, i) {
				if (clusters[i] == j) {
					// Add up 'hazium' and 'times' coordinates to calculate avg value
					keys.forEach(function(p) { sum[p] += Number(d[p]); });
					counter++;
				}
			});

			// Set the new position of the centroid as the avg
			if (counter !== 0) {
				keys.forEach(function(p) { centroids[j][p] = sum[p] / counter; });
			}
		}
	};
	
	function qualityDifference(kdata) {
		var sum = 0;
		for(j = 0; j < centroids.length; j++) {	
			kdata.forEach(function(d, i) {
				if (clusters[i] == j) {
					keys.forEach(function(p) { sum += Math.pow(Number(d[p]) - centroids[j][p], 2); });
				}
			});
		}
		return sum;
	};
	

    