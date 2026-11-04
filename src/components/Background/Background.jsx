import { useEffect, useState } from "react";
import "./Background.css";

// Enough to cover a new image arriving while the previous one still fades in
const MAX_LAYERS = 3;

/**
 * Full-screen background photo. Each new image is preloaded, then fades in
 * on its own layer on top of the previous one and stays on that layer. The
 * older layers underneath are only removed once fully covered, so the
 * visible image never has to move to another element (that hand-off could
 * leave the screen blank if the browser didn't repaint the new element).
 */
function Background({ url }) {
    const [layers, setLayers] = useState(() => [{ id: 0, url }]);

    useEffect(() => {
        if (!url) return;

        let cancelled = false;
        const image = new Image();

        image.onload = () => {
            if (cancelled) return;

            setLayers((current) => {
                if (current.at(-1).url === url) return current; // Already showing
                const next = { id: current.at(-1).id + 1, url };
                return [...current, next].slice(-MAX_LAYERS);
            });
        };
        image.src = url;

        return () => {
            cancelled = true;
            image.onload = null;
        };
    }, [url]);

    return (
        <div className="background" aria-hidden="true">
            {layers.map((layer, index) => (
                <div
                    key={layer.id}
                    // The first layer is there on load; only later ones fade in
                    className={index === 0 && layer.id === 0 ? "background-layer" : "background-layer fade-in"}
                    style={{ backgroundImage: `url("${layer.url}")` }}
                />
            ))}
        </div>
    );
}

export default Background;
