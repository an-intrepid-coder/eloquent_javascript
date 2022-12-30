/* The File Server implemented in chapter 20 of Eloquent JavaScript. This
   non-trivial example code is pretty much verbatim from Chapter 20, so I've 
   included the author's LICENSE in here:  */

/*******************************************************************************\
* Copyright (C) 2008-2020 by Marijn Haverbeke <marijnh@gmail.com>               *
*                                                                               *
* Permission is hereby granted, free of charge, to any person obtaining a copy  *
* of this software and associated documentation files (the "Software"), to deal *
* in the Software without restriction, including without limitation the rights  *
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell     *
* copies of the Software, and to permit persons to whom the Software is         *
* furnished to do so, subject to the following conditions:                      *
*                                                                               *
* The above copyright notice and this permission notice shall be included in    *
* all copies or substantial portions of the Software.                           *
*                                                                               *
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR    *
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,      *
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE   *
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER        *
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, *
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN     *
* THE SOFTWARE.                                                                 *
\*******************************************************************************/

const {createServer} = require("http");
const {parse} = require("url");
const {resolve, sep} = require("path");
const mime = require("mime"); 
const {createReadStream, createWriteStream} = require("fs");
const {stat, readdir, remdir, unlink} = require("fs").promises;

const port = process.argv[2]; // assumes a valid port was given 

const methods = Object.create(null); 

const cwd = process.cwd();

/* Attempts to resolve a given string to a local URL resource. Crucially,
   prevents access to directories outside of the scope of the program.  */
function urlPath(url) {
    let {pathname} = parse(url); 
    let path = resolve(decodeURIComponent(pathname.slice(1))); 
    if (path != cwd && !path.startsWith(cwd + sep)) { 
        throw {status: 403, body: "Forbidden"};
    }
    return path;
} 

function pipeStream(from, to) {
    return new Promise((resolve, reject) => {
        from.on("error", reject);
        to.on("error", reject);
        to.on("finish", resolve);
        from.pipe(to);
    });
}

methods.PUT = async function(request) {
    let path = urlPath(request);
    await pipeStream(request, createWriteStream(path));
    return {status: 204};
}

methods.DELETE = async function(request) {
    let path = urlPath(request.url);
    let stats;
    try {
        stats = await stat(path);
    } catch (error) {
        if (error.code != "ENOENT") throw error;
        else return {status: 204};
    }
    if (stats.isDirectory()) await rmdir(path);
    else await unlink(path);
    return {status: 204};
}

methods.GET = async function(request) {
    let path = urlPath(request.url);
    let stats;
    try {
        stats = await stat(path);
    } catch (error) {
        if (error.code != "ENOENT") throw error;
        else return {status: 404, body: "File not found."};
    }
    if (stats.isDirectory()) {
        return {body: (await readdir(path)).join("\n")};
    } else {
        return {body: createReadStream(path), type: mime.getType(path)};
    }
};

async function notAllowed(request) {
    return {
        status: 405,
        body: `Method: ${request.method} not allowed.`
    };
}

let server = createServer((request, response) => {
    let handler = methods[request.method] || notAllowed; // function object
    handler(request).catch(error => {
        if (error.status != null) return error;
        return {body: String(error), status: 500};
    }).then(({body, status = 200, type = "text/plain"}) => {
        response.writeHead(status, {"Content-Type": type});
        if (body && body.pipe) body.pipe(response); 
        else response.end(body);
    });
});

server.listen(port);

