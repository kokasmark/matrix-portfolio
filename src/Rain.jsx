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

    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWYZ0abcdefghijklmnopqrstuvwyz123456789'.split('');
    let texts = [
      [{ text: "Kokas Márk", x: Math.round(window.innerWidth / 2), y: 350,centered: true },
      { text: "Full stack developer", x: Math.round(window.innerWidth / 2), y: 380,centered: true },
      { text: "Home", x: 20, y: 18*2, page: 0 },
      { text: "Skills", x: 120, y: 18*2, page: 1 },
      { text: "Links", x: 250, y: 18*2, page: 2 },
      { text: "Education", x: 350, y: 18*2, page: 3 }],

      [{ text: "React.js", x: Math.round(window.innerWidth / 2), y: 300,centered: true },
      { text: "Node.js", x: Math.round(window.innerWidth / 2), y: 350,centered: true },
      { text: "C#", x: Math.round(window.innerWidth / 2), y: 400,centered: true },
      { text: ".Net Maui", x: Math.round(window.innerWidth / 2), y: 450,centered: true },
      { text: "Web design", x: Math.round(window.innerWidth / 2), y: 500,centered: true },
      { text: "Home", x: 20, y: 18*2, page: 0 },
      { text: "Skills", x: 120, y: 18*2, page: 1 },
      { text: "Links", x: 250, y: 18*2, page: 2 },
      { text: "Education", x: 350, y: 18*2, page: 3 }],

      [{ text: "Github: @kokasmark", x: Math.round(window.innerWidth / 2), y: 300,centered: true },
      { text: "Email: mark.kokas04@gmail.com", x: Math.round(window.innerWidth / 2), y: 350,centered: true },
      { text: "Home", x: 20, y: 18*2, page: 0 },
      { text: "Skills", x: 120, y: 18*2, page: 1 },
      { text: "Links", x: 250, y: 18*2, page: 2 },
      { text: "Education", x: 350, y: 18*2, page: 3 }],

      [{ text: "Széchenyi Istán University", x: Math.round(window.innerWidth / 2), y: 300, centered: true },
        { text: "Home", x: 20, y: 18*2, page: 0 },
        { text: "Skills", x: 120, y: 18*2, page: 1 },
        { text: "Links", x: 250, y: 18*2, page: 2 },
        { text: "Education", x: 350, y: 18*2, page: 3 }],
    ];

    texts.forEach((column) => {
      column.forEach((text) => {
          if (text.centered) {
              text.x -= (text.text.length * this.state.fontSize) / 2;
          }
      });
  });
    this.setState({texts});
    this.drops = Array.from({ length: canvas.width / 18}, () => [1,1,1,1,1]);
    this.fillDrops(texts,0,canvas.width / 18);
    this.startRain(ctx, canvas.width, canvas.height, this.state.fontSize);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
  }

  fillDrops(texts, page, columns) {
    this.dropsNeeded = Array.from({ length: columns }, () => 0); // Initialize with 0

    // Early return if texts or page is invalid
    if (!texts[page]) return;

    for (let i = 0; i < columns; i++) {
        let foundText = false;

        for (let { text, x } of texts[page]) {
            const colX = i * this.state.fontSize;

            if (colX >= x && colX < x + text.length * this.state.fontSize) {
                this.dropsNeeded[i]++; // Increment the drop count needed for this column
                foundText = true; // Mark that we found text in this column
            }
        }

        // If no text was found for this column, increment dropsNeeded by 1
        if (!foundText) {
            this.dropsNeeded[i]++;
        }
    }

    // Debug: Log the dropsNeeded for each column
    console.log(this.dropsNeeded);
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
      style={{
        position: 'absolute',
        left: `${item.x}px`,
        top: `${item.y+18*2}px`,
        width: `${item.text.length * 20}px`,
        height: `24px`,
        cursor: item.page == undefined ? 'default' : 'pointer',
        backgroundColor: 'rgba(0, 0, 0, 0)',
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

  checkIfShouldFormText(i, j, dropY, fontSize, ctx) {
    const currentTexts = this.state.texts[this.state.page];

    for (let { text, x, y, page } of currentTexts) {
        const colX = i * fontSize;

        // Check if the column X falls within the text's horizontal bounds
        if (colX >= x && colX < x + text.length * fontSize) {
            const dropPositionY = Math.floor(dropY * fontSize);

            // Check if the drop's Y position is close to the text's Y position
            if (Math.abs(dropPositionY - y) < 9) { // Adjust this threshold if needed
                const charIndex = Math.floor((colX - x) / fontSize);

                ctx.fillStyle = (page !== undefined && page === this.state.page) 
                    ? "#cd5a68" 
                    : "#78c2d2";

                console.log(`Filling text: ${text[charIndex]} at position (${colX}, ${dropPositionY})`);
                return text[charIndex]; // Return the character at this position
            }
        }
    }
    console.warn(`No character found for column ${i}, drop index ${j}`);
    return null; // Return null if no character is found
}

  startRain(ctx, width, height, fontSize) {
    if (this.rainEffect) return;

    this.rainEffect = setInterval(() => {
      ctx.fillStyle = 'rgba(45,52,65,0.5)';
      ctx.fillRect(0, 0, width, height);
    
      ctx.font = `${fontSize}px monospace`;
    
      for (let i = 0; i < this.drops.length; i++) {
        for (let j = 0; j < this.drops[i].length; j++) {
            let dropY = this.drops[i][j];
    
            const textChar = this.checkIfShouldFormText(i, j, dropY, fontSize, ctx);
            if (j < this.dropsNeeded[i]) {
                if (textChar !== null && !this.state.start && this.framesAfterLastNav > 30) {
                    if (this.drops[i].filter(y => y === dropY).length <= 1) {
                        ctx.fillText(textChar, i * fontSize, dropY * fontSize);
                    } else {
                        this.drops[i][j] += 1; // Move the drop down
                    }
                } else {
                    ctx.fillStyle = '#759abc';
                    const text = this.characters[Math.floor(Math.random() * this.characters.length)];
                    ctx.fillText(text, i * fontSize, dropY * fontSize);
    
                    if (dropY * fontSize > height && Math.random() > 0.95) {
                        this.drops[i][j] = 0; // Reset the drop
                        if (this.state.start) {
                            this.setState({ start: false });
                        }
                    }
    
                    this.drops[i][j] += 1; // Move the drop down
                }
            }
        }
    }
    
      this.framesAfterLastNav++;
    }, 16);// 30 FPS
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
