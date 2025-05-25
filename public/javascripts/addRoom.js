async function addRoom(url) {
  let capacity = prompt("Provide the new room's capacity");
  let pricePerDay = prompt("Provide the new rooms's price per day");
  let hotelId = prompt("Provide the new room's hotel ID");
  if (capacity === null || pricePerDay === null || hotelId === null) return;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      Capacity: capacity,
      PricePerDay: pricePerDay,
      HotelId: hotelId,
    }),
  })
    .then((response) => {
      if (response.ok) {
        const resData = "Created a new room";
        location.reload();
        return Promise.resolve(resData);
      }
      return Promise.reject(response);
    })
    .catch((response) => {
      alert(response.statusText);
    });
}
