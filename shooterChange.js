














function shooterChange(inCluster,curPos,curDir,clickDir){

	/*
	clicking left is clickDir = 0, clicking right is clickDir = 1.

	curPos is with respect to the origin of the *array*, which is defined as [0,0].

	inCluster is the "boolean" 2D array that has either 0's or 1's depending on whether the block is there or not.

	curDir is the direction the "rocket" is pointing, {N,E,S,W}={[0,1],[1,0],[0,-1],[-1,0]}.

	returns [newPos,newDir].
	*/

	var i=curPos[0];
	var j=curPos[1];

		switch(curDir){

			case [0,1]:
				var dirOrder=[[1,0],[0,1],[-1,0]];
				if(clickDir==0){
					if(checkInClusterBounds(inCluster,i-1,j-1) && inCluster[i-1][j-1]){
						newPos=[i-1,j-1];
						newDir=dirOrder[0];
					}
					if(checkInClusterBounds(inCluster,i-1,j) && inCluster[i-1][j]){
						newPos=[i-1,j];
						newDir=dirOrder[1];
					}
					else{
						newPos=[i,j];
						newDir=dirOrder[2];
					}
					
				}
				else{
					if(checkInClusterBounds(inCluster,i+1,j-1) && inCluster[i+1][j-1]){
						newPos=[i+1,j-1];
						newDir=dirOrder[2];
					}
					if(checkInClusterBounds(inCluster,i+1,j) && inCluster[i+1][j]){
						newPos=[i+1,j];
						newDir=dirOrder[1];
					}
					else{
						newPos=[i,j];
						newDir=dirOrder[0];
					}

				}	
				break;
			case [0,-1]:
				var dirOrder=[[1,0],[0,-1],[-1,0]];
			
				if(clickDir==0){
					if(checkInClusterBounds(inCluster,i+1,j+1) && inCluster[i+1][j+1]){
						newPos=[i+1,j+1];
						newDir=dirOrder[2];
					}
					if(checkInClusterBounds(inCluster,i+1,j) && inCluster[i+1][j]){
						newPos=[i-1,j];
						newDir=dirOrder[1];
					}
					else{
						newPos=[i,j];
						newDir=dirOrder[0];
					}
					
				}
				else{
					if(checkInClusterBounds(inCluster,i-1,j+1) && inCluster[i-1][j+1]){
						newPos=[i-1,j+1];
						newDir=dirOrder[0];
					}
					if(checkInClusterBounds(inCluster,i-1,j) && inCluster[i-1][j]){
						newPos=[i-1,j];
						newDir=dirOrder[1];
					}
					else{
						newPos=[i,j];
						newDir=dirOrder[2];
					}

				}	
				break;
			case [1,0]:
				var dirOrder=[[0,-1],[1,0],[0,1]];
			
				if(clickDir==0){
					if(checkInClusterBounds(inCluster,i+1,j-1) && inCluster[i+1][j-1]){
						newPos=[i+1,j-1];
						newDir=dirOrder[0];
					}
					if(checkInClusterBounds(inCluster,i,j-1) && inCluster[i][j-1]){
						newPos=[i,j-1];
						newDir=dirOrder[1];
					}
					else{
						newPos=[i,j];
						newDir=dirOrder[2];
					}
					
				}
				else{
					if(checkInClusterBounds(inCluster,i+1,j+1) && inCluster[i+1][j+1]){
						newPos=[i+1,j+1];
						newDir=dirOrder[2];
					}
					if(checkInClusterBounds(inCluster,i,j+1) && inCluster[i][j+1]){
						newPos=[i,j+1];
						newDir=dirOrder[1];
					}
					else{
						newPos=[i,j];
						newDir=dirOrder[0];
					}

				}	
			
				break;
			case [-1,0]:
				var dirOrder=[[0,-1],[-1,0],[0,1]];
			
				if(clickDir==0){
					if(checkInClusterBounds(inCluster,i-1,j+1) && inCluster[i-1][j+1]){
						newPos=[i-1,j+1];
						newDir=dirOrder[2];
					}
					if(checkInClusterBounds(inCluster,i,j+1) && inCluster[i][j+1]){
						newPos=[i,j+1];
						newDir=dirOrder[1];
					}
					else{
						newPos=[i,j];
						newDir=dirOrder[0];
					}
					
				}
				else{
					if(checkInClusterBounds(inCluster,i-1,j-1) && inCluster[i-1][j-1]){
						newPos=[i-1,j-1];
						newDir=dirOrder[0];
					}
					if(checkInClusterBounds(inCluster,i,j-1) && inCluster[i][j-1]){
						newPos=[i,j-1];
						newDir=dirOrder[1];
					}
					else{
						newPos=[i,j];
						newDir=dirOrder[2]; }
				}	
			
				break;

		}

		return([newPos,newDir]);
}

function checkInClusterBounds(inCluster,a,b){
	//i,j is relative to the array's origin block.
	var width=inCluster.length;
	var height=inCluster[0].length;
	if(a<0||a>=width||b<0||b>=height){

		return(0);
	}
	else{
		return(1);
	}

}


















