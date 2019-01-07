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
}

GameManager.prototype.addStartCell = function() {	//	초기 셀 2개 삽입	(실행5)
	for(var i=0;i<this.startCells;i++){
  	var value = Math.random() < 0.8 ? 2 : 4;
		this.grid.addRandomCell(value);	// 랜덤 위치에 초기 셀 삽입
    this.actuator.actuate();	// 제어기 작동으로 화면에 셀 실제 표시
	}
}




//grid.js
function Grid(size) {	// 그리드 (크기) (실행3)
	this.size = size;
  this.cells = []; // 셀 배열 정의
  this.build();		// (실행4)
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
  var random = Math.floor(Math.random() * positions.length);	// 랜덤으로 범위내 숫자 하나 선택
  var randomPosition = positions[random];	// 랜덤 숫자의 포지션 선택
  this.insertCell(new Cell(randomPosition,value))	// 셀 삽입
  
}

Grid.prototype.getPositionsAvailable = function() {	// 비어있는 셀 포지션 배열 받기
	var cellPositions = [];
  for(var x=0;x<this.size;x++){		// 모든 셀 탐색
  	for(var y=0;y<this.size;y++){		// 모든 셀 탐색
    	var position = {x:x,y:y};
      if(cellAvailable(position)){	// 포지션의 셀이 사용 가능 할 경우
      	cellPositions.push(position);	// 그 포지션을 배열에 푸쉬
      }
    }
  }
  return cellPositions;	// 포지션 배열 반환
}


Grid.prototype.insertCell = function(cell) {	// 셀 삽입
	if(cellAvailable(cell.position)){		//셀 사용 가능시
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
	this.clearContainer();	//타일 컨테이너 클리어
  grid.cells.forEach(function (column){	// 계산한 셀을 실제 셀에 삽입 
  	column.forEach(function(cell){
    	if(cell) {
      	this.addCell(cell);
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
  element.classList.add("tile","tile-"+tile.value,position);	// 클래스 첨가
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
