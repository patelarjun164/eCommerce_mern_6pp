import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas)

const usePasswordToggle = () => {
    // eslint-disable-next-line no-unused-vars
    const [visible, setVisibility] = useState(false);

    const Icon = (
        <FontAwesomeIcon 
            title={visible ? "Hide Password" : "Show Password"}
            icon={visible ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
            onClick={() => setVisibility(!visible)}
        />
    );

    const InputType = visible ? "text" : "password";


    return [InputType, Icon];
};

export default usePasswordToggle;
