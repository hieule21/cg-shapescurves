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

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(this.ctx);
                break;
            case 1:
                this.drawSlide1(this.ctx);
                break;
            case 2:
                this.drawSlide2(this.ctx);
                break;
            case 3:
                this.drawSlide3(this.ctx);
                break;
        }
    }

    // ctx:          canvas context
    drawSlide0(ctx) {
        this.drawRectangle({x: 200, y: 150}, {x: 600, y: 500}, [255, 0, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide1(ctx) {
        this.drawCircle({x: 400, y: 300}, 200, [255, 0, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide2(ctx) {
        this.drawBezierCurve({x: 200, y: 300}, {x: 300, y: 600}, {x: 600, y: 500}, {x: 600, y: 200}, [255, 0, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide3(ctx) {
        var color = [255, 0, 0, 255];
        //H
        this.drawRectangle({x: 100, y: 200}, {x: 100, y: 400}, color, ctx);
        this.drawRectangle({x: 100, y: 300}, {x: 200, y: 300}, color, ctx);
        this.drawRectangle({x: 200, y: 200}, {x: 200, y: 400}, color, ctx);
        //I
        this.drawRectangle({x: 250, y: 200}, {x: 250, y: 380}, color, ctx);
        this.drawCircle({x: 250, y: 390}, 20, color, ctx);

        //E
        this.drawRectangle({x: 300, y: 200}, {x: 300, y: 400}, color, ctx);
        this.drawRectangle({x: 400, y: 300}, {x: 300, y: 300}, color, ctx);
        this.drawRectangle({x: 400, y: 200}, {x: 300, y: 200}, color, ctx);
        this.drawRectangle({x: 400, y: 400}, {x: 300, y: 400}, color, ctx);
        
        //U
        this.drawRectangle({x: 450, y: 230}, {x: 450, y: 400}, color, ctx);
        this.drawRectangle({x: 550, y: 230}, {x: 550, y: 400}, color, ctx);
        this.drawBezierCurve({x: 450, y: 230}, {x: 480, y: 200}, {x: 550, y: 200}, {x: 550, y: 230}, color, ctx);
    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawRectangle(left_bottom, right_top, color, ctx) {
        var left_top =  {x: left_bottom.x, y: right_top.y};
        var right_bottom = {x: right_top.x, y: left_bottom.y};
        var points = [left_bottom, left_top, right_top, right_bottom];
        this.drawShape(points, color, ctx);
        if(this.show_points) {
            this.drawVertices(points, color, ctx);
        }
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawCircle(center, radius, color, ctx) {
        var points = [];
        var curAngle = 0;
        var eachAngle = 360/this.num_curve_sections;
        while(curAngle < 360) {
            var x = center.x + radius * Math.cos(this.toRadians(curAngle));
            var y = center.y + radius * Math.sin(this.toRadians(curAngle));
            points.push({x, y});
            curAngle += eachAngle;
        }
        this.drawShape(points, color, ctx);
        //Draw vertices
        if(this.show_points) {
            for(let i = 0; i < points.length - 1; i++) {
                this.drawSmallRect(points[i], color, ctx);
            }
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawBezierCurve(pt0, pt1, pt2, pt3, color, ctx) {
        var points = [];
        var eachStep = 1/this.num_curve_sections;
        var curT = 0;
        while(curT < 1) {
            var x = Math.pow(1-curT, 3) * pt0.x + 3 * Math.pow(1-curT, 2) * curT * pt1.x + 3 * (1-curT) * Math.pow(curT, 2) * pt2.x + Math.pow(curT, 3) * pt3.x;
            var y = Math.pow(1-curT, 3) * pt0.y + 3 * Math.pow(1-curT, 2) * curT * pt1.y + 3 * (1-curT) * Math.pow(curT, 2) * pt2.y + Math.pow(curT, 3) * pt3.y;
            points.push({x, y});
            curT += eachStep;
        }
        this.drawShape(points, color, ctx, true);
        if(this.show_points) {
            this.drawVertices(points, color, ctx, true);
        }
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawLine(pt0, pt1, color, ctx)
    {
        ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3]/255.0) + ')';
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();
    }

    drawShape(points, color, ctx, isBezier) {
        if(points.length !== 0) {
            var clone = points;
            if(!isBezier) {
                clone.push(clone[0]);
            }
            for(let i = 0; i < clone.length - 1; i++) {
                this.drawLine(clone[i], clone[i+1], color, ctx);
            }
        }
    }
    
    drawVertices(points, color, ctx, isBezier) {
        var len = points.length;
        if(!isBezier) len = len - 1;
        for(let i = 0; i < len; i++) {
            this.drawSmallRect(points[i], color, ctx);
        }
    }

    drawSmallRect(point, color, ctx) {
        var left_bottom = {x: point.x - 10, y: point.y - 10};
        var right_top = {x: point.x + 10, y: point.y + 10};
        var left_top =  {x: left_bottom.x, y: right_top.y};
        var right_bottom = {x: right_top.x, y: left_bottom.y};
        var points = [left_bottom, left_top, right_top, right_bottom];
        this.drawShape(points, color, ctx);
    }

    toRadians(degrees) {
        return degrees * (Math.PI/180);
    }
};
