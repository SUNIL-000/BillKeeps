import axios from "axios";

export const getPinCode = async (lat, lon) => {
  try {
    let pincode = "";
    const result = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );

    if (result.status !== 200) {
      console.log("failed to get pincode");
      return (pincode = null);
    }

    const address = result?.data?.address;

    if (address && address.postcode) {
      console.log("Pincode found");

      return (pincode = address.postcode);
    } else {
      console.log("Pincode not found");
      return (pincode = null);
    }
  } catch (error) {
    console.log("Error occur while fetching pincode");
    console.log(error);
   
  }
};
