const timer = () => {
  setTimeout(() => {
    console.log("2000 ms have passed"), 2000;
  });
  return new Promise(resolve => setTimeout(resolve, 1000));
};
timer().then(() => console.log("works"));
//   .then(() => console.log("1000 milliseconds be done yo"))
//   .catch("err");
