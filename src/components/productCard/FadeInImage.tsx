import { useState } from "react";

const FadeInImage = ({
    className = "",
    ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <img
            {...props}
            onLoad={() => setLoaded(true)}
            className={`tw:transition-opacity tw:duration-700 tw:ease-in-out ${
                loaded ? "tw:opacity-100" : "tw:opacity-0"
            } ${className}`}
        />
    );
};

export default FadeInImage;
