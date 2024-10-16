import React, { Component } from 'react';

class MatrixRain extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.drops = [];
    this.rainEffect = null;
    this.currentTextDrops = []
    this.state = {
      rainActive: true,
      isTextVisible: false,
      start: true,
      page: 0,
      texts: [[]]
    };
  }
  handlePageClick = (page) => {
    this.setState({ page });
    this.currentTextDrops.forEach((index) => {
      this.drops[index[0]][index[1]] += 1 + Math.round(Math.random() * 5);
    })

    this.currentTextDrops = []
  };

  renderOverlayElements() {
    return this.state.texts[this.state.page].map((item, index) => (
      <div
        key={index}
        onClick={() => this.handlePageClick(item.page)}
        style={{
          position: 'absolute',
          left: `${item.x}px`,
          top: `${item.y}px`,
          width: `${item.text.length * 20}px`,
          height: `24px`,
          cursor: item.page == undefined ? 'default' : 'pointer',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          zIndex: 10
        }}
      />
    ));
  }
  componentDidMount() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth + 18;
    canvas.height = window.innerHeight;

    const fontSize = 18;
    const columns = canvas.width / fontSize;

    this.drops = Array.from({ length: Math.floor(columns) }, () => {
      return Array.from({ length: 2 }, () => Math.floor(Math.random() * canvas.height / fontSize));
    });
    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWYZ0abcdefghijklmnopqrstuvwyz123456789'.split('');

    this.startRain(ctx, canvas.width, canvas.height, fontSize);
    this.getInfo();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
  }

  async getInfo() {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    try {
      const response = await fetch("https://github-contributions-api.deno.dev/kokasmark.json", requestOptions);
      const result = await response.json();

      this.setState({texts:[
        [{ text: "Kokas Márk", x: Math.round(window.innerWidth / 2) - 300, y: 350 },
        { text: "Full stack developer", x: Math.round(window.innerWidth / 2) - 50, y: 350 },
        { text: `I made ${result.totalContributions} commits this year!`, x: Math.round(window.innerWidth / 2) , y: 400 },
        { text: "Home", x: 20, y: window.innerHeight - 18, page: 0 },
        { text: "Skills", x: 120, y: window.innerHeight - 18, page: 1 },
        { text: "Links", x: 250, y: window.innerHeight - 18, page: 2 },
        { text: "Education", x: 350, y: window.innerHeight - 18, page: 3 }],

        [{ text: "React.js", x: Math.round(window.innerWidth / 2) - 400, y: 300 },
        { text: "Node.js", x: Math.round(window.innerWidth / 2) - 250, y: 450 },
        { text: "C#", x: Math.round(window.innerWidth / 2) - 80, y: 300 },
        { text: ".Net Maui", x: Math.round(window.innerWidth / 2), y: 600 },
        { text: "Web design", x: Math.round(window.innerWidth / 2) + 160, y: 350 },
        { text: "Home", x: 20, y: window.innerHeight - 18, page: 0 },
        { text: "Skills", x: 120, y: window.innerHeight - 18, page: 1 },
        { text: "Links", x: 250, y: window.innerHeight - 18, page: 2 },
        { text: "Education", x: 350, y: window.innerHeight - 18, page: 3 }],

        [{ text: "Github: @kokasmark", x: Math.round(window.innerWidth / 2) - 400, y: 300 },
        { text: "Email: mark.kokas04@gmail.com", x: Math.round(window.innerWidth / 2) - 50, y: 350 },
        { text: "Home", x: 20, y: window.innerHeight - 18, page: 0 },
        { text: "Skills", x: 120, y: window.innerHeight - 18, page: 1 },
        { text: "Links", x: 250, y: window.innerHeight - 18, page: 2 },
        { text: "Education", x: 350, y: window.innerHeight - 18, page: 3 }],

        [{ text: "Currently learning at Széchenyi Istán University", x: Math.round(window.innerWidth / 2) - 400, y: 300 },
        { text: "Home", x: 20, y: window.innerHeight - 18, page: 0 },
        { text: "Skills", x: 120, y: window.innerHeight - 18, page: 1 },
        { text: "Links", x: 250, y: window.innerHeight - 18, page: 2 },
        { text: "Education", x: 350, y: window.innerHeight - 18, page: 3 }],
      ]});
    } catch (error) {
      console.error(error);
    };
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

  checkIfShouldFormText(i,j, dropY, fontSize, ctx) {
    for (let { text, x, y, page } of this.state.texts[this.state.page]) {
      const colX = i * fontSize;
      if (colX >= x && colX < x + text.length * fontSize && Math.abs(Math.floor(dropY * fontSize) - y) < 10) {

        const charIndex = Math.floor((colX - x) / fontSize);
        if (!this.currentTextDrops.includes([i,j]) && page == undefined) {
          this.currentTextDrops.push([i,j]);
        }

        if (page != undefined && page == this.state.page) {
          ctx.fillStyle = "#cd5a68";
        }
        else {
          ctx.fillStyle = "#78c2d2";
        }
        return text[charIndex];
      }
    }
    return null;
  }

  startRain(ctx, width, height, fontSize) {
    if (this.rainEffect) return;

    this.rainEffect = setInterval(() => {
      ctx.fillStyle = 'rgba(45,52,65,0.3)';
      ctx.fillRect(0, 0, width, height);
    
      ctx.font = `${fontSize}px monospace`;
    
      for (let i = 0; i < this.drops.length; i++) {
        for (let j = 0; j < this.drops[i].length; j++) {
          let dropY = this.drops[i][j];
    
          const textChar = this.checkIfShouldFormText(i, j, dropY, fontSize, ctx);
          if (textChar !== null) {
            if(this.drops[i].filter(y => y==dropY).length <= 1){
              ctx.fillText(textChar, i * fontSize, dropY * fontSize);
            }
            else{
              this.drops[i][j] += 1;
            }
          } else {
            ctx.fillStyle = '#759abc';
            const text = this.characters[Math.floor(Math.random() * this.characters.length)];
            ctx.fillText(text, i * fontSize, dropY * fontSize);
    
            if (dropY * fontSize > height && Math.random() > 0.975) {
              this.drops[i][j] = 0;
            }
    
            this.drops[i][j] += 1;
          }
        }
      }
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
