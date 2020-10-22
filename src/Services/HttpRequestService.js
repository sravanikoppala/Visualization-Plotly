import axios from 'axios';

const httpRequest = (props) => {
    return axios.get(props);
};

export default httpRequest;