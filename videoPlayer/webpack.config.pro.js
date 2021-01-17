const path=require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装


module.exports={
    entry:"./src/main.ts",
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"main.js"
    },
    resolve:{
        "extensions":['.ts','.js','.json']
    },
    devServer:{
        contentBase:"/dist",
        port:'8080',
        open:true,
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader'],
                exclude:[
                    path.resolve(__dirname,'src/components')
                ]
            },
            {
                test:/\.css$/,
                use:['style-loader',{
                    loader:'css-loader',
                    options:{
                        modules:true
                    }
                }],
                include:[
                    path.resolve(__dirname,'src/components')
                ]
            },//只有此路径下的css文件才作为模块去加载,具体详细配置可以参考css-loader官网
            {
                test:/\.(eot|woff2|woff|ttf|svg)$/,
                use:[{
                    loader:"file-loader",
                    options:{
                        outputPath:"iconfont"
                    }
                }]
            },
            {
                test:/\.ts$/,
                use:['ts-loader'],
                exclude:/node_modules/
            }
        ],
        
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'})
      ],
    mode:"production"
}