#!/usr/bin/env node

"use strict";

const AWS = require("aws-sdk");

if (require.main === module) {
  if (process.argv.length !== 4) {
    console.log("Usage: createPresignedUrl <bucket> <filename>");
    process.exit(1);
  }

  // This will load credentials automatically from whatever source you have configured.
  const s3 = new AWS.S3();

  let params = {
    Bucket: process.argv[2],
    Key: process.argv[3],
    Expires: 315360000 // 10 years
  };

  // Create the signed URL and print it to stdout
  let putUrl = s3.getSignedUrl("putObject", params);
  let getUrl = s3.getSignedUrl("getObject", params);
  console.log(
    `You can upload to this URL like this:\n\n    curl "${putUrl}" --upload-file FILENAME\n`
  );
  console.log(
    `You can then download the file like this:\n\n    curl -o FILENAME "${getUrl}"`
  );
}
