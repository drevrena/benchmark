FROM node:18

RUN apt-get update -y
RUN apt install imagemagick -y
RUN apt install graphicsmagick -y
RUN apt install libvips libvips-dev -y
RUN curl -fsSL https://deno.land/x/install/install.sh | sh 
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"
WORKDIR /home/benchmark
COPY . .

RUN npm install

CMD ["/bin/bash", "-c", "deno run --allow-all deno-bench.js;node node-bench.js"]