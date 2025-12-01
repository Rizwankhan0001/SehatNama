const indianCities = [
  // Major Metro Cities
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  
  // Tier 1 Cities
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
  { name: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781 },
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
  { name: 'Pimpri-Chinchwad', state: 'Maharashtra', lat: 18.6298, lng: 73.7997 },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
  { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
  
  // Tier 2 Cities
  { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
  { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
  { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
  { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178 },
  { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064 },
  { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
  { name: 'Kalyan-Dombivli', state: 'Maharashtra', lat: 19.2403, lng: 73.1305 },
  { name: 'Vasai-Virar', state: 'Maharashtra', lat: 19.4912, lng: 72.8054 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
  { name: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973 },
  { name: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
  { name: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304 },
  { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
  { name: 'Navi Mumbai', state: 'Maharashtra', lat: 19.0330, lng: 73.0297 },
  { name: 'Allahabad', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
  { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 },
  { name: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
  { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828 },
  
  // More Cities
  { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
  { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
  { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296 },
  { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
  { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794 },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064 },
  { name: 'Hubli-Dharwad', state: 'Karnataka', lat: 15.3647, lng: 75.1240 },
  { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304 },
  { name: 'Moradabad', state: 'Uttar Pradesh', lat: 28.8386, lng: 78.7733 },
  { name: 'Mysore', state: 'Karnataka', lat: 12.2958, lng: 76.6394 },
  { name: 'Gurgaon', state: 'Haryana', lat: 28.4595, lng: 77.0266 },
  { name: 'Aligarh', state: 'Uttar Pradesh', lat: 27.8974, lng: 78.0880 },
  { name: 'Jalandhar', state: 'Punjab', lat: 31.3260, lng: 75.5762 },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047 },
  { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460 },
  { name: 'Mira-Bhayandar', state: 'Maharashtra', lat: 19.2952, lng: 72.8544 },
  { name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941 },
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365 },
  { name: 'Bhiwandi', state: 'Maharashtra', lat: 19.3002, lng: 73.0635 },
  { name: 'Saharanpur', state: 'Uttar Pradesh', lat: 29.9680, lng: 77.5552 },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732 },
  { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119 },
  { name: 'Amravati', state: 'Maharashtra', lat: 20.9374, lng: 77.7796 },
  { name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910 },
  { name: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029 },
  { name: 'Bhilai', state: 'Chhattisgarh', lat: 21.1938, lng: 81.3509 },
  { name: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8828 },
  { name: 'Firozabad', state: 'Uttar Pradesh', lat: 27.1592, lng: 78.3957 },
  { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { name: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lng: 79.9865 },
  { name: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519 },
  { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322 },
  { name: 'Durgapur', state: 'West Bengal', lat: 23.5204, lng: 87.3119 },
  { name: 'Asansol', state: 'West Bengal', lat: 23.6739, lng: 86.9524 },
  { name: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536 },
  { name: 'Nanded', state: 'Maharashtra', lat: 19.1383, lng: 77.3210 },
  { name: 'Kolhapur', state: 'Maharashtra', lat: 16.7050, lng: 74.2433 },
  { name: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399 },
  { name: 'Akola', state: 'Maharashtra', lat: 20.7002, lng: 77.0082 },
  { name: 'Gulbarga', state: 'Karnataka', lat: 17.3297, lng: 76.8343 },
  { name: 'Jamnagar', state: 'Gujarat', lat: 22.4707, lng: 70.0577 },
  { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885 },
  { name: 'Loni', state: 'Uttar Pradesh', lat: 28.7333, lng: 77.2833 },
  { name: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953 },
  { name: 'Jhansi', state: 'Uttar Pradesh', lat: 25.4484, lng: 78.5685 },
  { name: 'Ulhasnagar', state: 'Maharashtra', lat: 19.2215, lng: 73.1645 },
  { name: 'Jammu', state: 'Jammu and Kashmir', lat: 32.7266, lng: 74.8570 },
  { name: 'Sangli-Miraj & Kupwad', state: 'Maharashtra', lat: 16.8524, lng: 74.5815 },
  { name: 'Mangalore', state: 'Karnataka', lat: 12.9141, lng: 74.8560 },
  { name: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lng: 77.7172 },
  { name: 'Belgaum', state: 'Karnataka', lat: 15.8497, lng: 74.4977 },
  { name: 'Ambattur', state: 'Tamil Nadu', lat: 13.1143, lng: 80.1548 },
  { name: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567 },
  { name: 'Malegaon', state: 'Maharashtra', lat: 20.5579, lng: 74.5287 },
  { name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002 },
  { name: 'Jalgaon', state: 'Maharashtra', lat: 21.0077, lng: 75.5626 },
  { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125 },
  { name: 'Maheshtala', state: 'West Bengal', lat: 22.5093, lng: 88.2482 },
  { name: 'Davanagere', state: 'Karnataka', lat: 14.4644, lng: 75.9218 },
  { name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804 },
  { name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lng: 78.0373 },
  { name: 'Rajpur Sonarpur', state: 'West Bengal', lat: 22.4707, lng: 88.3953 },
  { name: 'Rajahmundry', state: 'Andhra Pradesh', lat: 17.0005, lng: 81.8040 },
  { name: 'Bokaro', state: 'Jharkhand', lat: 23.6693, lng: 86.1511 },
  { name: 'South Dumdum', state: 'West Bengal', lat: 22.6138, lng: 88.4000 },
  { name: 'Bellary', state: 'Karnataka', lat: 15.1394, lng: 76.9214 },
  { name: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869 },
  { name: 'Gopalpur', state: 'West Bengal', lat: 22.5448, lng: 88.3412 },
  { name: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868 },
  { name: 'Bhagalpur', state: 'Bihar', lat: 25.2425, lng: 86.9842 },
  { name: 'Muzaffarnagar', state: 'Uttar Pradesh', lat: 29.4727, lng: 77.7085 },
  { name: 'Bhatpara', state: 'West Bengal', lat: 22.8697, lng: 88.4019 },
  { name: 'Panihati', state: 'West Bengal', lat: 22.6928, lng: 88.3740 },
  { name: 'Latur', state: 'Maharashtra', lat: 18.4088, lng: 76.5604 },
  { name: 'Dhule', state: 'Maharashtra', lat: 20.9042, lng: 74.7749 },
  { name: 'Rohtak', state: 'Haryana', lat: 28.8955, lng: 76.6066 },
  { name: 'Korba', state: 'Chhattisgarh', lat: 22.3595, lng: 82.7501 },
  { name: 'Bhilwara', state: 'Rajasthan', lat: 25.3407, lng: 74.6269 },
  { name: 'Berhampur', state: 'Odisha', lat: 19.3149, lng: 84.7941 },
  { name: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647 },
  { name: 'Ahmednagar', state: 'Maharashtra', lat: 19.0948, lng: 74.7480 },
  { name: 'Mathura', state: 'Uttar Pradesh', lat: 27.4924, lng: 77.6737 },
  { name: 'Kollam', state: 'Kerala', lat: 8.8932, lng: 76.6141 },
  { name: 'Avadi', state: 'Tamil Nadu', lat: 13.1147, lng: 80.0982 },
  { name: 'Kadapa', state: 'Andhra Pradesh', lat: 14.4673, lng: 78.8242 },
  { name: 'Kamarhati', state: 'West Bengal', lat: 22.6708, lng: 88.3742 },
  { name: 'Sambalpur', state: 'Odisha', lat: 21.4669, lng: 83.9812 },
  { name: 'Bilaspur', state: 'Chhattisgarh', lat: 22.0797, lng: 82.1391 },
  { name: 'Shahjahanpur', state: 'Uttar Pradesh', lat: 27.8831, lng: 79.9077 },
  { name: 'Satara', state: 'Maharashtra', lat: 17.6805, lng: 74.0183 },
  { name: 'Bijapur', state: 'Karnataka', lat: 16.8302, lng: 75.7100 },
  { name: 'Rampur', state: 'Uttar Pradesh', lat: 28.8152, lng: 79.0250 },
  { name: 'Shivamogga', state: 'Karnataka', lat: 13.9299, lng: 75.5681 },
  { name: 'Chandrapur', state: 'Maharashtra', lat: 19.9615, lng: 79.2961 },
  { name: 'Junagadh', state: 'Gujarat', lat: 21.5222, lng: 70.4579 },
  { name: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144 },
  { name: 'Alwar', state: 'Rajasthan', lat: 27.5530, lng: 76.6346 },
  { name: 'Bardhaman', state: 'West Bengal', lat: 23.2324, lng: 87.8615 },
  { name: 'Kulti', state: 'West Bengal', lat: 23.7307, lng: 86.8451 },
  { name: 'Kakinada', state: 'Andhra Pradesh', lat: 16.9891, lng: 82.2475 },
  { name: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941 },
  { name: 'Parbhani', state: 'Maharashtra', lat: 19.2608, lng: 76.7734 },
  { name: 'Tumkur', state: 'Karnataka', lat: 13.3379, lng: 77.1022 },
  { name: 'Khammam', state: 'Telangana', lat: 17.2473, lng: 80.1514 },
  { name: 'Ozhukarai', state: 'Puducherry', lat: 11.9416, lng: 79.7865 },
  { name: 'Bihar Sharif', state: 'Bihar', lat: 25.2073, lng: 85.5238 },
  { name: 'Panipat', state: 'Haryana', lat: 29.3909, lng: 76.9635 },
  { name: 'Darbhanga', state: 'Bihar', lat: 26.1542, lng: 85.8918 },
  { name: 'Bally', state: 'West Bengal', lat: 22.6503, lng: 88.3406 },
  { name: 'Aizawl', state: 'Mizoram', lat: 23.7271, lng: 92.7176 },
  { name: 'Dewas', state: 'Madhya Pradesh', lat: 22.9676, lng: 76.0534 },
  { name: 'Ichalkaranji', state: 'Maharashtra', lat: 16.6889, lng: 74.4608 },
  { name: 'Karnal', state: 'Haryana', lat: 29.6857, lng: 76.9905 },
  { name: 'Bathinda', state: 'Punjab', lat: 30.2110, lng: 74.9455 },
  { name: 'Jalna', state: 'Maharashtra', lat: 19.8347, lng: 75.8861 },
  { name: 'Eluru', state: 'Andhra Pradesh', lat: 16.7107, lng: 81.0953 },
  { name: 'Kirari Suleman Nagar', state: 'Delhi', lat: 28.7041, lng: 77.0437 },
  { name: 'Barabanki', state: 'Uttar Pradesh', lat: 26.9254, lng: 81.1840 },
  { name: 'Purnia', state: 'Bihar', lat: 25.7771, lng: 87.4753 },
  { name: 'Satna', state: 'Madhya Pradesh', lat: 24.5667, lng: 80.8167 },
  { name: 'Mau', state: 'Uttar Pradesh', lat: 25.9420, lng: 83.5615 },
  { name: 'Sonipat', state: 'Haryana', lat: 28.9931, lng: 77.0151 },
  { name: 'Farrukhabad', state: 'Uttar Pradesh', lat: 27.3929, lng: 79.5804 },
  { name: 'Sagar', state: 'Madhya Pradesh', lat: 23.8388, lng: 78.7378 },
  { name: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536 },
  { name: 'Durg', state: 'Chhattisgarh', lat: 21.1900, lng: 81.2849 },
  { name: 'Imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368 },
  { name: 'Ratlam', state: 'Madhya Pradesh', lat: 23.3315, lng: 75.0367 },
  { name: 'Hapur', state: 'Uttar Pradesh', lat: 28.7306, lng: 77.7669 },
  { name: 'Arrah', state: 'Bihar', lat: 25.5562, lng: 84.6644 },
  { name: 'Karimnagar', state: 'Telangana', lat: 18.4386, lng: 79.1288 },
  { name: 'Anantapur', state: 'Andhra Pradesh', lat: 14.6819, lng: 77.6006 },
  { name: 'Etawah', state: 'Uttar Pradesh', lat: 26.7756, lng: 79.0199 },
  { name: 'Ambernath', state: 'Maharashtra', lat: 19.1869, lng: 73.1570 },
  { name: 'North Dumdum', state: 'West Bengal', lat: 22.6448, lng: 88.4226 },
  { name: 'Bharatpur', state: 'Rajasthan', lat: 27.2152, lng: 77.4977 },
  { name: 'Begusarai', state: 'Bihar', lat: 25.4182, lng: 86.1272 },
  { name: 'New Delhi', state: 'Delhi', lat: 28.6000, lng: 77.2000 },
  { name: 'Gandhidham', state: 'Gujarat', lat: 23.0800, lng: 70.1300 },
  { name: 'Baranagar', state: 'West Bengal', lat: 22.6422, lng: 88.3742 },
  { name: 'Tiruvottiyur', state: 'Tamil Nadu', lat: 13.1594, lng: 80.3008 },
  { name: 'Puducherry', state: 'Puducherry', lat: 11.9416, lng: 79.8083 },
  { name: 'Sikar', state: 'Rajasthan', lat: 27.6094, lng: 75.1399 },
  { name: 'Thoothukudi', state: 'Tamil Nadu', lat: 8.7642, lng: 78.1348 },
  { name: 'Rewa', state: 'Madhya Pradesh', lat: 24.5364, lng: 81.2961 },
  { name: 'Mirzapur', state: 'Uttar Pradesh', lat: 25.1463, lng: 82.5644 },
  { name: 'Raichur', state: 'Karnataka', lat: 16.2120, lng: 77.3439 },
  { name: 'Pali', state: 'Rajasthan', lat: 25.7711, lng: 73.3234 },
  { name: 'Ramagundam', state: 'Telangana', lat: 18.4455, lng: 79.4753 },
  { name: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642 },
  { name: 'Vijayanagaram', state: 'Andhra Pradesh', lat: 18.1124, lng: 83.4956 },
  { name: 'Katihar', state: 'Bihar', lat: 25.5482, lng: 87.5696 },
  { name: 'Nagarcoil', state: 'Tamil Nadu', lat: 8.1790, lng: 77.4338 },
  { name: 'Sri Ganganagar', state: 'Rajasthan', lat: 29.9038, lng: 73.8772 },
  { name: 'Karawal Nagar', state: 'Delhi', lat: 28.7041, lng: 77.2946 },
  { name: 'Mango', state: 'Jharkhand', lat: 22.8409, lng: 86.2106 },
  { name: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lng: 79.1378 },
  { name: 'Bulandshahr', state: 'Uttar Pradesh', lat: 28.4041, lng: 77.8498 },
  { name: 'Uluberia', state: 'West Bengal', lat: 22.4733, lng: 88.1053 },
  { name: 'Murwara', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
  { name: 'Sambhal', state: 'Uttar Pradesh', lat: 28.5906, lng: 78.5506 },
  { name: 'Singrauli', state: 'Madhya Pradesh', lat: 24.1997, lng: 82.6739 },
  { name: 'Jaunpur', state: 'Uttar Pradesh', lat: 25.7479, lng: 82.6841 },
  { name: 'Kumbakonam', state: 'Tamil Nadu', lat: 10.9601, lng: 79.3788 },
  { name: 'Bellampalli', state: 'Telangana', lat: 19.0544, lng: 79.4929 },
  { name: 'Khora', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
  { name: 'Guntakal', state: 'Andhra Pradesh', lat: 15.1669, lng: 77.3811 },
  { name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 },
  { name: 'Hazaribagh', state: 'Jharkhand', lat: 23.9981, lng: 85.3615 },
  { name: 'Hindupur', state: 'Andhra Pradesh', lat: 13.8283, lng: 77.4911 },
  { name: 'Barbil', state: 'Odisha', lat: 22.1167, lng: 85.3833 }
];

const specialties = ['Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Orthopedic', 'Psychiatrist', 'General Physician'];

const firstNames = ['Rajesh', 'Priya', 'Suresh', 'Meera', 'Vikram', 'Anjali', 'Amit', 'Kiran', 'Ravi', 'Sunita', 'Harpreet', 'Deepak', 'Kavita', 'Rahul', 'Nisha', 'Arjun', 'Pooja', 'Sanjay', 'Neha', 'Arun', 'Divya', 'Manoj', 'Rekha', 'Vinod', 'Shweta', 'Ramesh', 'Geeta', 'Ashok', 'Seema', 'Prakash', 'Anita', 'Rohit', 'Preeti', 'Ajay', 'Sushma', 'Nitin', 'Ritu', 'Sachin', 'Vandana', 'Mukesh', 'Jyoti', 'Rajeev', 'Madhuri', 'Sunil', 'Kavitha', 'Anil', 'Shilpa', 'Mahesh', 'Usha', 'Santosh'];

const lastNames = ['Sharma', 'Gupta', 'Kumar', 'Iyer', 'Reddy', 'Patil', 'Banerjee', 'Shah', 'Agarwal', 'Verma', 'Singh', 'Tiwari', 'Jain', 'Deshmukh', 'Patel', 'Rao', 'Nair', 'Mishra', 'Pandey', 'Sinha', 'Chandra', 'Prasad', 'Yadav', 'Saxena', 'Malhotra', 'Kapoor', 'Chopra', 'Mehta', 'Aggarwal', 'Bhatia'];

function generateDoctors() {
  const doctors = [];
  
  for (let i = 0; i < 500; i++) {
    const city = indianCities[Math.floor(Math.random() * indianCities.length)];
    const specialty = specialties[Math.floor(Math.random() * specialties.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    const doctor = {
      name: `Dr. ${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@prescure.com`,
      specialty: specialty,
      experience: Math.floor(Math.random() * 25) + 5,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reviewCount: Math.floor(Math.random() * 300) + 50,
      location: {
        address: `${Math.floor(Math.random() * 999) + 1} Medical Center, ${city.name}`,
        city: city.name,
        state: city.state,
        zipCode: `${Math.floor(Math.random() * 900000) + 100000}`,
        coordinates: {
          type: 'Point',
          coordinates: [city.lng + (Math.random() - 0.5) * 0.1, city.lat + (Math.random() - 0.5) * 0.1]
        }
      },
      availability: generateAvailability(),
      consultationFee: Math.floor(Math.random() * 1500) + 500,
      image: `https://images.unsplash.com/photo-${getRandomImage()}?w=300&h=300&fit=crop&crop=face`,
      about: `Experienced ${specialty.toLowerCase()} with expertise in modern medical practices and patient care.`,
      education: [`MBBS from ${getRandomMedicalCollege()}`, `MD/MS from ${getRandomMedicalCollege()}`],
      languages: getRandomLanguages(city.state),
      phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`
    };
    
    doctors.push(doctor);
  }
  
  return doctors;
}

function generateAvailability() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const numDays = Math.floor(Math.random() * 4) + 2;
  const selectedDays = [];
  
  for (let i = 0; i < numDays; i++) {
    const day = days[Math.floor(Math.random() * days.length)];
    if (!selectedDays.find(d => d.day === day)) {
      selectedDays.push({
        day: day,
        startTime: '09:00',
        endTime: Math.random() > 0.5 ? '17:00' : '18:00'
      });
    }
  }
  
  return selectedDays;
}

function getRandomImage() {
  const images = [
    '1559839734-2b71ea197ec2',
    '1612349317150-e413f6a5b16d',
    '1594824475317-8b7b0c8b8b8b',
    '1582750433449-648ed127bb54'
  ];
  return images[Math.floor(Math.random() * images.length)];
}

function getRandomMedicalCollege() {
  const colleges = [
    'AIIMS Delhi', 'AIIMS Mumbai', 'KEM Hospital Mumbai', 'MAMC Delhi', 'CMC Vellore',
    'PGIMER Chandigarh', 'JIPMER Puducherry', 'BHU Varanasi', 'KGMU Lucknow',
    'GMC Mumbai', 'Madras Medical College', 'Osmania Medical College', 'NIMHANS Bangalore'
  ];
  return colleges[Math.floor(Math.random() * colleges.length)];
}

function getRandomLanguages(state) {
  const languageMap = {
    'Maharashtra': ['Marathi', 'Hindi', 'English'],
    'Karnataka': ['Kannada', 'English', 'Hindi'],
    'Tamil Nadu': ['Tamil', 'English', 'Hindi'],
    'Kerala': ['Malayalam', 'English', 'Hindi'],
    'Gujarat': ['Gujarati', 'Hindi', 'English'],
    'Rajasthan': ['Hindi', 'English', 'Rajasthani'],
    'Punjab': ['Punjabi', 'Hindi', 'English'],
    'West Bengal': ['Bengali', 'Hindi', 'English'],
    'Uttar Pradesh': ['Hindi', 'English', 'Urdu'],
    'Bihar': ['Hindi', 'English'],
    'Jharkhand': ['Hindi', 'English'],
    'Odisha': ['Odia', 'Hindi', 'English'],
    'Assam': ['Assamese', 'Hindi', 'English'],
    'Telangana': ['Telugu', 'Hindi', 'English'],
    'Andhra Pradesh': ['Telugu', 'Hindi', 'English']
  };
  
  return languageMap[state] || ['Hindi', 'English'];
}

module.exports = generateDoctors;