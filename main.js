//game.manager.js
function GameManager(size,actuator) {	// 게임 매니저	(크기, 제어기) 선언시 변수 선언 및 초기화 (실행2)
	this.size = size
  this.grid = new Grid(this.size);	// 크기에 맞는 그리드 인스턴스화 (실행3)
  this.actuator = actuator;
  this.startCells = 2;
  this.setup();		// (실행5)
}

GameManager.prototype.setup = function() {	// 게임 매니저 셋업 (실행5)
	this.addStartCell();
	this.addKeyDownEvent();
}

GameManager.prototype.addKeyDownEvent = function() {	// 키 다운 이벤트 삽입
	var self = this;
	document.addEventListener("keydown",function(e){	
		if (e.key==="ArrowLeft") {	// 왼쪽 화살표 누를시
			self.grid.mergeLeft();
			self.grid.goLeft();
			self.addStartCell();
			self.actuator.actuate(self.grid);
		};

		if (e.key==="ArrowRight") {	// 오른쪽 화살표 누를시
			self.grid.mergeRight();
			self.grid.goRight();
			self.addStartCell();
			self.actuator.actuate(self.grid);
		}
		if (e.key==="ArrowUp") {	// 위쪽 화살표 누를시
			self.grid.mergeUp();
			self.grid.goUp();
			self.addStartCell();
			self.actuator.actuate(self.grid);
		}
		if (e.key==="ArrowDown") {	// 아래쪽 화살표 누를시
			self.grid.mergeDown();
			self.grid.goDown();
			self.addStartCell();
			self.actuator.actuate(self.grid);
		}

	})

	
}


GameManager.prototype.addStartCell = function() {	//	초기 셀 2개 삽입	(실행5)
	for(var i=0;i<this.startCells;i++){
  	var value = Math.random() < 0.8 ? 2 : 4;
		this.grid.addRandomCell(value);	// 랜덤 위치에 초기 셀 삽입
    this.actuator.actuate(this.grid);	// 제어기 작동으로 화면에 셀 실제 표시
	}
}




//grid.js
function Grid(size) {	// 그리드 (크기) (실행3)
	this.size = size;
  this.cells = []; // 셀 배열 정의
  this.build();		// (실행4)
}

Grid.prototype.mergeLeft = function() {
	var self = this;
	var cellExist = [];
	var i = 0;
	self.cells.forEach(function(row){	// 각 행마다
		cellExist[i] = [];	
		row.forEach(function(cell){		// 각 셀마다
			if(cell){
				cellExist[i].push(cell);	// 존재하는 셀 배열에 넣기
			}
		});
		i++;
	});
	cellExist.forEach(function(row){	// 각 행에 존재하는 셀
		for(var j=0;j<row.length-1;j++){	// 0부터 존재하는 셀 개수 -1 만큼 실행
			if(row[j].value===row[j+1].value){	// 이웃하는 두 셀의 값이 같다면
				self.cells[row[j].x][row[j].y].value *= 2;	// 그 셀의 값 *2
				self.cells[row[j+1].x][row[j+1].y] = null;	// 그 이웃 셀 null 삽입
				j = 10;	// 조건문 탈출
			}
		}
	});
}

Grid.prototype.mergeRight = function() {
	
}

Grid.prototype.mergeUp = function() {
	var self = this;
	var cellExist = [];
	var i = 0;	// i = 열
	for(var y=0; y<self.size; y++){	// 각 열마다
		cellExist[i] = [];
		for(var x=0; x<self.size; x++){	// 해당 열의 각 셀마다
			var cell = self.cells[x][y];
			if(cell){
				cellExist[i].push(cell);	// 존재하는 셀 배열에 넣기
			}
		}
		i++;
	}
	cellExist.forEach(function(column){	// 각 열에 존재하는 셀
		for(var j=0;j<column.length-1;j++){	// 0부터 존재하는 셀 개수 -1 만큼 실행
			if(column[j].value===column[j+1].value){	// 이웃하는 두 셀의 값이 같다면
				self.cells[column[j].x][column[j].y].value *= 2;	// 그 셀의 값 *2
				self.cells[column[j+1].x][column[j+1].y] = null;	// 그 이웃 셀 null 삽입
				j = 10;	// 조건문 탈출
			}
		}
	});
}

Grid.prototype.mergeDown = function() {

}


Grid.prototype.goRight = function() {	// 오른쪽으로 보내기
	var self = this;
	for(var x = 0; x<self.size ; x++) {	// x가 0부터 3까지
		for(var y = self.size-1; y>=0 ; y--) {	// y 는 3부터 0까지
			for(var j = 0; j<3;j++){	// 3회 반복
				if(self.cells[x][y]===null) {	// 값이 null 일 경우
					for(var i = y; i>0; i--) {	// i가 y부터 1까지
						if(self.cells[x][i-1]!==null){	// 전 셀이 null이 아닐경우
							self.cells[x][i-1].y++;		// 셀 y 값 +1;
							self.cells[x][i-1].position.y++;
						}
						self.cells[x][i] = self.cells[x][i-1];	// 이전 셀을 현재 셀에 삽입
						self.cells[x][i-1] = null;	// 이전 셀 값은 null
					}	
				}
			}
		}
	}
}

Grid.prototype.goLeft = function() {	// 왼쪽으로 보내기
	var self = this;
	for(var x = 0; x<self.size ; x++) {	// x가 0부터 3까지
		for(var y = 0; y<self.size ; y++) {	// y 는 0부터 3까지
			for(var j = 0; j<3;j++){	// 3회 반복
				if(self.cells[x][y]===null) {	// 값이 null 일 경우
					for(var i = y; i<3; i++) {	// i가 y부터 2까지
						if(self.cells[x][i+1]!==null){	// 이후 셀이 null이 아닐경우
							self.cells[x][i+1].y--;		// 셀 y 값 -1;
							self.cells[x][i+1].position.y--;
						}
						self.cells[x][i] = self.cells[x][i+1];	// 이후 셀을 현재 셀에 삽입
						self.cells[x][i+1] = null;	// 이후 셀 값은 null
					}	
				}
			}
		}
	}
}

Grid.prototype.goUp = function() {	// 위쪽으로 보내기
	var self = this;
	for(var y = 0; y<self.size ; y++) {	// y가 0부터 3까지
		for(var x = 0; y<self.size ; y++) {	// x 는 0부터 3까지
			for(var j = 0; j<3;j++){	// 3회 반복
				if(self.cells[x][y]===null) {	// 값이 null 일 경우
					for(var i = x; i<3; i++) {	// i가 x부터 2까지
						if(self.cells[i+1][y]!==null){	// 이후 셀이 null이 아닐경우
							self.cells[i+1][y].x--;		// 셀 x 값 -1;
							self.cells[i+1][y].position.x--;
						}
						self.cells[i][y] = self.cells[i+1][y];	// 이후 셀을 현재 셀에 삽입
						self.cells[i+1][y] = null;	// 이후 셀 값은 null
					}	
				}
			}
		}
	}
}

Grid.prototype.goDown = function() {	// 아래쪽으로 보내기
	var self = this;
	for(var y = 0; y<self.size ; y++) {	// y가 0부터 3까지
		for(var x = self.size-1 ; x>=0 ; x--) {	// x 는 3부터 0까지
			for(var j = 0; j<3;j++){	// 3회 반복
				if(self.cells[x][y]===null) {	// 값이 null 일 경우
					for(var i = x; i > 0; i--) {	// i가 x부터 1까지
						if(self.cells[i-1][y]!==null){	// 이전 셀이 null이 아닐경우
							self.cells[i-1][y].x++;		// 셀 x 값 +1;
							self.cells[i-1][y].position.x++;
						}
						self.cells[i][y] = self.cells[i-1][y];	// 이전 셀을 현재 셀에 삽입
						self.cells[i-1][y] = null;	// 이전 셀 값은 null
					}	
				}
			}
		}
	}
}


Grid.prototype.build = function() {		// 크기*크기의 그리드에 셀을 "null"로 삽입 (실행4)
	for(var x=0;x<this.size;x++){
  	this.cells[x] = [];
  	for(var y=0;y<this.size;y++){
    	this.cells[x].push(null);
    }
  }
}

Grid.prototype.addRandomCell = function(value) {	// 랜덤 셀 삽입(값)
	var positions = this.getPositionsAvailable();	// 비어있는 셀 포지션 배열 받기
	if (!this.isFull()){ 
		var random = Math.floor(Math.random() * positions.length);	// 랜덤으로 범위내 숫자 하나 선택
		var randomPosition = positions[random];	// 랜덤 숫자의 포지션 선택
		this.insertCell(new Cell(randomPosition,value))	// 셀 삽입
	}
}

Grid.prototype.isFull = function() {
	var positions = this.getPositionsAvailable();	// 비어있는 셀 포지션 배열 받기
	if (positions.length===0) {
		alert("게임 오버");
		return true;
	}
	else return false;
	
}


Grid.prototype.getPositionsAvailable = function() {	// 비어있는 셀 포지션 배열 받기
	var cellPositions = [];
  for(var x=0;x<this.size;x++){		// 모든 셀 탐색
  	for(var y=0;y<this.size;y++){		// 모든 셀 탐색
    	var position = {x:x,y:y};
      if(this.cellAvailable(position)){	// 포지션의 셀이 사용 가능 할 경우
      	cellPositions.push(position);	// 그 포지션을 배열에 푸쉬
      }
    }
  }
  return cellPositions;	// 포지션 배열 반환
}


Grid.prototype.insertCell = function(cell) {	// 셀 삽입
	if(this.cellAvailable(cell.position)){		//셀 사용 가능시
  	this.cells[cell.x][cell.y] = cell;	//셀 삽입
	}
}

Grid.prototype.getRandomPosition = function() {	// 랜덤 포지션 받기 점유여부 미구분
	var position;
  position = {
 		x : Math.floor(Math.random() * self.size),
 		y : Math.floor(Math.random() * self.size)
  };
  return position;  
  
}

Grid.prototype.cellAvailable = function(position) {	// 포지션을 받아서 사용 가능한 셀인지 확인
	return this.cells[position.x][position.y]===null	// 셀에 null이 들어갈 경우 사용가능
}



//html_actuator.js
function HTMLActuator() {	// 제어기 (실행2)
	this.tileContainer = document.getElementsByClassName("tile-container")[0];	//타일 컨테이너를 참조
}

HTMLActuator.prototype.actuate = function(grid) {	// 제어기 작동
	var self = this; this.clearContainer();	//타일 컨테이너 클리어
  grid.cells.forEach(function (column){	// 계산한 셀을 실제 셀에 삽입 
  	column.forEach(function(cell){
    	if(cell) {
      	self.addCell(cell);
      }
    });
  });
}

HTMLActuator.prototype.clearContainer = function(){	//타일 컨테이너 클리어
	while(this.tileContainer.firstChild){	// 첫번째 자식이 없어질때까지
  	this.tileContainer.removeChild(this.tileContainer.firstChild);	// 첫번째 자식 삭제
  }
}

HTMLActuator.prototype.addCell = function(cell){
	var element = document.createElement("div");		// div 태그 생성
  var x = cell.x+1;	
  var y = cell.y+1;
  var position = "tile-position-"+x+"-"+y;	// 타일 포지션 정의
  element.classList.add("tile","tile-"+cell.value,position);	// 클래스 첨가
  element.textContent = cell.value;	// 값 추가
  this.tileContainer.appendChild(element);	//타일 컨테이너에 삽입
}

//cell.js
function Cell(position,value) {	// 셀(포지션,값) 클래스
	this.position = position;
	this.x = position.x;	// 셀 x값
  this.y = position.y;	// 셀 y값
  this.value = value || 2;	// 값이 없으면 2
  this.previousPosition = null;	// 이전 포지션 = null
}



//application.js
document.addEventListener("DOMContentLoaded",function() {	// 로딩되면 제어기와 매니저 선언(실행1)
	var actuator = new HTMLActuator();
  var manager = new GameManager(4,actuator);
})
