FROM public.ecr.aws/docker/library/node:20.12.2-alpine
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.1 /lambda-adapter /opt/extensions/lambda-adapter
EXPOSE 8080
WORKDIR "/var/task"
ADD package.json /var/task/package.json
ADD package-lock.json /var/task/package-lock.json
RUN npm install --omit=dev
ADD dist/ /var/task
CMD ["node", "index.js"]
