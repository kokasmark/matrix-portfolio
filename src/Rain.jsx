import React, { Component } from 'react';

class MatrixRain extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();  // Reference to the canvas element
    this.drops = [];
    this.rainEffect = null;
    this.currentTextDrops = []
    this.state = {
      rainActive: true,
      isTextVisible: false,
      start: true,
      page: 0
    };

    this.texts = [[]]
    this.getInfo();
    
  }
  handlePageClick = (page) => {
    this.setState({ page });
    this.currentTextDrops.forEach((index) =>{
        this.drops[index] += 1 + Math.round(Math.random()*5);
    })

    this.currentTextDrops = []
  };

  // Render transparent overlay for clickable text elements
  renderOverlayElements() {
    return this.texts[this.state.page].map((item, index) => (
      <div
        key={index}
        onClick={() => this.handlePageClick(item.page)}  // Set page when clicked
        style={{
          position: 'absolute',
          left: `${item.x}px`,
          top: `${item.y}px`,
          width: `${item.text.length * 20}px`,  // Adjust width based on the text length and font size
          height: `24px`,                      // Adjust height based on font size
          cursor: item.page == undefined ? 'default' : 'pointer',                   // Make the element look clickable
          backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background to allow clicking
          zIndex: 10                           // Ensure overlay is above the canvas
        }}
      />
    ));
  }
  componentDidMount() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 18;
    const columns = canvas.width / fontSize;

    this.drops = Array(Math.floor(columns)).fill(1);
    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWYZ0abcdefghijklmnopqrstuvwyz123456789'.split('');

    this.startRain(ctx, canvas.width, canvas.height, fontSize);

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
  }

  async getInfo(){
    const requestOptions = {
        method: "GET",
        redirect: "follow"
      };
      
      try {
        const response = await fetch("https://github-contributions-api.deno.dev/kokasmark.json", requestOptions);
        const result = await response.json();

        this.texts = [
            [{ text: "Kokas Márk", x: Math.round(window.innerWidth/2)-300, y: 350 },
                { text: "Full stack developer", x: Math.round(window.innerWidth/2)-50, y: 350 },
                { text: `I made ${result.totalContributions} commits this year!`, x: Math.round(window.innerWidth/2)+350, y: 400 },
                { text: "Home", x: 20, y: window.innerHeight-18,page: 0},
                { text: "Skills", x: 120, y: window.innerHeight-18,page: 1},
                { text: "Links", x: 250, y: window.innerHeight-18,page: 2},
                { text: "Education", x: 350, y: window.innerHeight-18,page: 3}],
    
            [{ text: "React.js", x: Math.round(window.innerWidth/2)-400, y: 300 },
                { text: "Node.js", x: Math.round(window.innerWidth/2)-250, y: 450 },
                { text: "C#", x: Math.round(window.innerWidth/2)-80, y: 300 },
                { text: ".Net Maui", x: Math.round(window.innerWidth/2), y: 600 },
                { text: "Home", x: 20, y: window.innerHeight-18,page: 0},
                { text: "Web design", x: Math.round(window.innerWidth/2)+160, y: 350 },
                { text: "Skills", x: 120, y: window.innerHeight-18,page: 1},
                { text: "Links", x: 270, y: window.innerHeight-18,page: 2},
                { text: "Education", x: 390, y: window.innerHeight-18,page: 3}],
            
            [{ text: "Github: @kokasmark", x: Math.round(window.innerWidth/2)-400, y: 300 },
                { text: "Email: mark.kokas04@gmail.com", x: Math.round(window.innerWidth/2)-50, y: 350 },
                { text: "Home", x: 20, y: window.innerHeight-18,page: 0},
                { text: "Skills", x: 120, y: window.innerHeight-18,page: 1},
                { text: "Links", x: 270, y: window.innerHeight-18,page: 2},
                { text: "Education", x: 390, y: window.innerHeight-18,page: 3}],

            [{ text: "Currently learning at Széchenyi Istán University", x: Math.round(window.innerWidth/2)-400, y: 300 },
                { text: "Home", x: 20, y: window.innerHeight-18,page: 0},
                { text: "Skills", x: 120, y: window.innerHeight-18,page: 1},
                { text: "Links", x: 270, y: window.innerHeight-18,page: 2},
                { text: "Education", x: 390, y: window.innerHeight-18,page: 3}],
          ];
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

   // Function to check if a raindrop should stop and form a character
   checkIfShouldFormText(i, dropY, fontSize,ctx) {
    for (let { text, x, y,page } of this.texts[this.state.page]) {
      const colX = i * fontSize;
      // Only stop the rain when it's exactly at or below the Y position of the text
      if (colX >= x && colX < x + text.length * fontSize && Math.abs(Math.floor(dropY * fontSize)-y) < 10) {
        // Find the index of the character in the text that matches this column
        const charIndex = Math.floor((colX - x) / fontSize);
        if (!this.currentTextDrops.includes(i) && page == undefined){
            this.currentTextDrops.push(i);
        }

        if(page != undefined && page == this.state.page){
            ctx.fillStyle = "#cd5a68";
        }
        else{
            ctx.fillStyle = "#78c2d2";
        }
        return text[charIndex]; // Return the character to be formed at this position
      }
    }
    return null;
  }
  
  startRain(ctx, width, height, fontSize) {
    if (this.rainEffect) return; // Avoid multiple intervals

    this.rainEffect = setInterval(() => {
      ctx.fillStyle = 'rgba(45,52,65,0.3)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < this.drops.length; i++) {
        let dropY = this.drops[i]; // Y position of the current drop

        // Check if the drop is at a position where it should form a character from `this.texts`
        const textChar = this.checkIfShouldFormText(i, dropY, fontSize,ctx);
        
        if (textChar !== null && !this.state.start) {
          ctx.fillText(textChar, i * fontSize, dropY * fontSize);

        } else {
            ctx.fillStyle = '#759abc';
          const text = this.characters[Math.floor(Math.random() * this.characters.length)];
          ctx.fillText(text, i * fontSize, dropY * fontSize);

          // Reset the drop if it's off-screen or randomly stop it
          if (dropY * fontSize > height && Math.random() > 0.975) {
            this.drops[i] = 0;
            if (this.state.start){
                this.setState({start: false})
            }
          }

          this.drops[i]++;
        }
      }
    }, 33); // 30 FPS
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
