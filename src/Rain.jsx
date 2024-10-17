import React, { Component } from 'react';

class MatrixRain extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.drops = [];
    this.rainEffect = null;
    this.currentTextDrops = []
    this.dropsNeeded = []
    this.framesAfterLastNav = 0
    this.state = {
      rainActive: true,
      isTextVisible: false,
      start: true,
      page: 0,
      texts: [[]],
      columns: 0,
      fontSize: 18,
    };
  }
  componentDidMount() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth + 18;
    canvas.height = window.innerHeight;

    this.setState({columns: canvas.width / 18, fontSize: 18})

    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWYZ0abcdefghijklmnopqrstuvwyz123456789@!?;#'.split('');
    let texts = [
      [{ text: "Kokas Márk", x: Math.round(window.innerWidth / 2), y: 350,centered: true },
      { text: "Full stack developer", x: Math.round(window.innerWidth / 2), y: 380,centered: true },
      { text: "Home", x: 20, y: 40, page: 0 },
      { text: "Skills", x: 120, y: 40, page: 1 },
      { text: "Links", x: 250, y: 40, page: 2 },
      { text: "Education", x: 350, y: 40, page: 3 }],

      [{ text: "React.js", x: Math.round(window.innerWidth / 2), y: 300,centered: true },
      { text: "Node.js", x: Math.round(window.innerWidth / 2), y: 350,centered: true },
      { text: "C#", x: Math.round(window.innerWidth / 2), y: 400,centered: true },
      { text: ".Net Maui", x: Math.round(window.innerWidth / 2), y: 450,centered: true },
      { text: "Web design", x: Math.round(window.innerWidth / 2), y: 500,centered: true },
      { text: "Home", x: 20, y: 40, page: 0 },
      { text: "Skills", x: 120, y: 40, page: 1 },
      { text: "Links", x: 250, y: 40, page: 2 },
      { text: "Education", x: 350, y: 40, page: 3 }],

      [{ text: "Github: @kokasmark", x: Math.round(window.innerWidth / 2), y: 300,centered: true },
      { text: "Email: mark.kokas04@gmail.com", x: Math.round(window.innerWidth / 2), y: 350,centered: true },
      { text: "Home", x: 20, y: 40, page: 0 },
      { text: "Skills", x: 120, y: 40, page: 1 },
      { text: "Links", x: 250, y: 40, page: 2 },
      { text: "Education", x: 350, y: 40, page: 3 }],

      [{ text: "2019-2024", x: Math.round(window.innerWidth / 2), y: 300, centered: true },
        { text: "Győri SZC Jedlik Ányos Szakközépiskola", x: Math.round(window.innerWidth / 2), y: 350, centered: true },
        { text: "2024-?", x: Math.round(window.innerWidth / 2), y: 400, centered: true },
        { text: "Széchenyi István University", x: Math.round(window.innerWidth / 2), y: 450, centered: true },
        { text: "Home", x: 20, y: 40, page: 0 },
        { text: "Skills", x: 120, y: 40, page: 1 },
        { text: "Links", x: 250, y: 40, page: 2 },
        { text: "Education", x: 350, y: 40, page: 3 }],
    ];

    texts.forEach((column) => {
      column.forEach((text) => {
          if (text.centered) {
              text.x -= (text.text.length * this.state.fontSize) / 2;
          }
      });
  });
    this.setState({texts});
    this.drops = Array.from({ length: canvas.width / 18}, () => [1,1,1,1,1,1]);
    this.fillDrops(texts,0,canvas.width / 18);
    this.startRain(ctx, canvas.width, canvas.height, 18);

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
  }
  
  fillDrops(texts, page, columns) {
    this.dropsNeeded = Array.from({ length: columns }, () => 0);
    if (!texts[page]) return;

    for (let i = 0; i < columns; i++) {
        let foundText = false;

        for (let { text, x } of texts[page]) {
            const colX = i * this.state.fontSize;

            if (colX >= x && colX < x + text.length * this.state.fontSize) {
                this.dropsNeeded[i]++;
                foundText = true;
            }
        }
        if (!foundText) {
            this.dropsNeeded[i]++;
        }
    }
    console.log(this.dropsNeeded)
}

handleHover(event) {
  const { clientX, clientY } = event;
  const { fontSize } = this.state;

  const columnIndex = Math.round(clientX / fontSize);
  const columnDrops = this.drops[columnIndex];

  let closestDropIndex = -1;

  columnDrops.forEach((dropY, index) => {
      const dropYPosition = dropY * fontSize;
      const distance = Math.abs(clientY - dropYPosition);

      if (distance < 9) {
          closestDropIndex = index;
      }
  });

  if(closestDropIndex != -1){
    this.drops[columnIndex][closestDropIndex] += 1
  }
}
handlePageClick = (page) => {
  this.setState({ page });
  this.fillDrops(this.state.texts,page,this.state.columns)
  this.framesAfterLastNav = 0;
};

renderOverlayElements() {
  return this.state.texts[this.state.page].map((item, index) => (
    <div
      key={index}
      onClick={() => (item.page == undefined ? {} : this.handlePageClick(item.page))}
      onMouseMove={item.page == undefined ? (e)=>this.handleHover(e) : ()=>{}}
      style={{
        position: 'fixed',
        left: `${item.x}px`,
        top: `${item.y-18}px`,
        width: `${item.text.length * 20}px`,
        height: `24px`,
        cursor: 'pointer',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        padding: 2,
        zIndex: 10
      }}
    />
  ));
}
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    this.stopRain();
  }

  handleResize = () => {
    const canvas = this.canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  handleScroll = () => {

  };

  checkIfShouldFormText(i, dropY, fontSize, ctx) {
    const currentTexts = this.state.texts[this.state.page];

    try{
    for (let { text, x, y, page } of currentTexts) {
        const colX = i * fontSize;
        if (colX >= x && colX < x + text.length * fontSize) {
            const dropPositionY = Math.floor(dropY * fontSize);
            if (Math.abs(dropPositionY - y) < 10) {
                const charIndex = Math.floor((colX - x) / fontSize);

                ctx.fillStyle = (page !== undefined && page === this.state.page) 
                    ? "#cd5a68" 
                    : "#759abc";
                return text[charIndex];
            }
        }
    }
  }catch(e){
    console.log(e)
  }
    return null;
}

  startRain(ctx, width, height, fontSize) {
    if (this.rainEffect) return;

    this.rainEffect = setInterval(() => {
      ctx.fillStyle = this.state.start ? 'transparent':'rgba(0,0,0,0.25)';
      ctx.fillRect(0, 0, width, height);
    
      ctx.font = `${fontSize}px monospace`;
    
      for (let i = 0; i < this.drops.length; i++) {
        var count = 0;
        for (let j = 0; j < this.drops[i].length; j++) {
            let dropY = this.drops[i][j];
    
            const textChar = this.checkIfShouldFormText(i,dropY, fontSize, ctx);
            if (count < this.dropsNeeded[i]) {
                if (textChar !== null && !this.state.start && this.framesAfterLastNav > 33) {
                  if (this.drops[i].filter(y => Math.abs(y - dropY) < 0.5).length <= 1) {
                    
                    ctx.fillText(textChar, i * fontSize, dropY * fontSize);
                } else {
                    // If another drop is occupying nearly the same position, increment this drop's y-position
                    this.drops[i][j] += 1;
                }
                count++;
                } else if( j <= this.dropsNeeded[i]) {
                    ctx.fillStyle = '#759abc';
                    let text = this.characters[Math.floor(Math.random() * this.characters.length)];
                    if(this.state.start){
                      text = 'Welcome '.split('')[(i+dropY%8)%8]
                    }
                    ctx.fillText(text, i * fontSize, dropY * fontSize);
    
                    if (dropY * fontSize > height && Math.random() > 0.95) {
                        this.drops[i][j] = 0; 
                        if (this.state.start) {
                            this.setState({ start: false });
                        }
                    }
    
                    this.drops[i][j] += 1; 
                }
            }
        }
    }
    
      this.framesAfterLastNav++;
    }, 33);// 30 FPS
  }
  stopRain() {
    clearInterval(this.rainEffect);
    this.rainEffect = null;
  }

  render() {
    return (
      <div style={{ position: 'relative', height: '200vh', backgroundColor: 'black' }}>
        <canvas ref={this.canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 1 }} />
        {this.renderOverlayElements()}
      </div>
    );
  }
}

export default MatrixRain;
