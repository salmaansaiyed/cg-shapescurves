class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let framebuffer = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(framebuffer);
                break;
            case 1:
                this.drawSlide1(framebuffer);
                break;
            case 2:
                this.drawSlide2(framebuffer);
                break;
            case 3:
                this.drawSlide3(framebuffer);
                break;
        }

        this.ctx.putImageData(framebuffer, 0, 0);
    }

    // framebuffer:  canvas ctx image data
    drawSlide0(framebuffer) { // rectangle
        var color = [175, 200, 150, 255];
        var left_bottom = {x: 100, y: 100};
        var right_top = {x: 300, y: 200};
        this.drawRectangle(left_bottom, right_top, color, framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide1(framebuffer) { // circle
        var color = [175, 200, 150, 255];
        this.drawCircle(center, radius, color, framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide2(framebuffer) { // bezier curve
        var color = [175, 200, 150, 255];
        drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer);
    }

    // framebuffer:  canvas ctx image data
    drawSlide3(framebuffer) { // name
        var color = [175, 200, 150, 255];
        var pts = [
            [//s: [
                {x: 200, y: 300},
                {x: 100, y: 300},
                {x: 100, y: 200},
                {x: 200, y: 200},
                {x: 200, y: 100},
                {x: 100, y: 100},
                {x: 10, y: 10},
                {x: 999, y: 999},
                {x: 10, y: 100},
                {x: 790, y: 100}
            ],
            [//a: [
                {x: 250, y: 100},
                {x: 300, y: 300},
                {x: 350, y: 100},
                {x: 350, y: 200},
                {x: 250, y: 200}
            ],
            [//l: [
                {x: 100, y: 100},
                {x: 300, y: 100},
                {x: 300, y: 200},
                {x: 100, y: 200}
            ],
            [//m: [
                {x: 100, y: 100},
                {x: 300, y: 100},
                {x: 300, y: 200},
                {x: 100, y: 200}
            ],
            [//a2: [
                {x: 100, y: 100},
                {x: 300, y: 100},
                {x: 300, y: 200},
                {x: 100, y: 200}
            ],
            [//a3: [
                {x: 100, y: 100},
                {x: 300, y: 100},
                {x: 300, y: 200},
                {x: 100, y: 200}
            ],
            [//n: [
                {x: 100, y: 100},
                {x: 300, y: 100},
                {x: 300, y: 200},
                {x: 100, y: 200}
            ]
        ];
        console.log(pts[0]);
        console.log(pts[0][1]);
        for (var letter = 0; letter < pts.length; letter++)
        {
            for (var i = 1; i < pts[letter].length; i++)
            {
                this.drawLine(pts[letter][i-1], pts[letter][i%pts[letter].length], color, framebuffer);
            }
        }
    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawRectangle(left_bottom, right_top, color, framebuffer) {
        var i;
        var pts = {
            vertices: [
                left_bottom,                        //{x: 100, y: 100},
                {x: right_top.x, y: left_bottom.y}, //{x: 300, y: 100},
                right_top,                          //{x: 300, y: 200},
                {x: left_bottom.x, y: right_top.y}  //{x: 100, y: 200}
            ]
        };
        for (i = 1; i < pts.vertices.length+1; i++)
        {
            this.drawLine(pts.vertices[i-1], pts.vertices[i%4], color, framebuffer);
        }
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawCircle(center, radius, color, framebuffer) {
        
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawBezierCurve(pt0, pt1, pt2, pt3, color, framebuffer) {
        
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // framebuffer:  canvas ctx image data
    drawLine(pt0, pt1, color, framebuffer)
    {
        var x0 = pt0.x;
        var y0 = pt0.y;
        var x1 = pt1.x;
        var y1 = pt1.y;
        // code from class here
        if (Math.abs(y1 - y0) <= Math.abs(x1 - x0)) //|m| <= 1
        {
            if (x0 < x1)
            {
                this.drawLineLow(x0, y0, x1, y1, color, framebuffer);
            }
            else
            {
                this.drawLineLow(x1, y1, x0, y0, color, framebuffer);
            }
        }
        else									//|m| > 1
        {
            if (y0 < y1)
            {
                this.drawLineHigh(x0, y0, x1, y1, color, framebuffer);
            }
            else
            {
                this.drawLineHigh(x1, y1, x0, y0, color, framebuffer);
            }
        }
    }

    pixelIndex(x, y, framebuffer)
        {
            return 4 * y * framebuffer.width + 4 * x;
        }

    setFramebufferColor(framebuffer, px, color)
        {
            framebuffer.data[px + 0] = color[0];
            framebuffer.data[px + 1] = color[1];
            framebuffer.data[px + 2] = color[2];
            framebuffer.data[px + 3] = color[3];
        }

    drawLineLow(x0, y0, x1, y1, color, framebuffer)
    {
        var A = y1 - y0;
        var B = x0 - x1;
        var iy = 1;
        if (A < 0) {
            iy = -1;
            A *= -1;
        }
        var D = 2 * A + B;
        var x = x0;
        var y = y0;
        var px;
        while (x <= x1)
        {
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            x += 1;
            if (D <= 0)
            {
                D += 2 * A;
            }
            else
            {
                D += 2 * A + 2 * B;
                y += iy;
            }
        }
    }

    drawLineHigh(x0, y0, x1, y1, color, framebuffer)
    {
        //difference between drawLineLow and drawLineHigh
        //was that we switched all cases of x and y
        //except those used in function calls
        var A = x1 - x0;
        var B = y0 - y1;
        var ix = 1;
        if (A < 0) {
            ix = -1;// WAS PREVIOUSLY i = -1;
            A *= -1;
        }
        var D = 2 * A + B;
        var x = x0;
        var y = y0;
        var px;
        while (y <= y1)
        {
            px = this.pixelIndex(x, y, framebuffer);
            this.setFramebufferColor(framebuffer, px, color);
            y += 1;
            if (D <= 0)
            {
                D += 2 * A;
            }
            else
            {
                D += 2 * A + 2 * B;
                x += ix;
            }
        }
    }
};
