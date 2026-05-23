const fs = require('fs');
let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// 1. Add state for widgetRect
const hookText = `    const [imgError, setImgError] = useState(false);`;
const newHookText = `    const [imgError, setImgError] = useState(false);
    const [widgetRect, setWidgetRect] = useState({ x: 20, y: 160, width: 350, height: 810 });`;

if (file.includes(hookText) && !file.includes('widgetRect')) {
    file = file.replace(hookText, newHookText);
}

// 2. Add onDrag and onResize to Rnd
const rndText = `<Rnd
                default={{
                    x: 20,
                    y: 160,
                    width: 350,
                    height: 810,
                }}`;
const newRndText = `<Rnd
                default={{
                    x: 20,
                    y: 160,
                    width: 350,
                    height: 810,
                }}
                onDrag={(e, d) => setWidgetRect(prev => ({ ...prev, x: d.x, y: d.y }))}
                onResize={(e, direction, ref, delta, position) => {
                    setWidgetRect({
                        x: position.x,
                        y: position.y,
                        width: ref.offsetWidth,
                        height: ref.offsetHeight
                    });
                }}`;

if (file.includes(rndText)) {
    file = file.replace(rndText, newRndText);
}

// 3. Update TransformComponent for chatImagePreview
// We need to find the specific TransformComponent block inside `chatImagePreview ? (`
const searchBlock = `                    <TransformWrapper 
                        key={chatImagePreview}
                        initialScale={1} 
                        centerOnInit={true}
                        doubleClick={{ disabled: false }}
                        pinch={{ step: 5 }}
                    >
                        <TransformComponent wrapperStyle={{ width: 'calc(100vw - 390px)', height: '100dvh', position: 'absolute', right: 0, top: 0 }} contentStyle={{ width: '100%', height: '100%' }}>`;

const newSearchBlock = `                    <TransformWrapper 
                        key={chatImagePreview}
                        initialScale={1} 
                        centerOnInit={true}
                        doubleClick={{ disabled: false }}
                        pinch={{ step: 5 }}
                    >
                        {(() => {
                            const isWidgetOnLeft = (widgetRect.x + widgetRect.width / 2) < (window.innerWidth / 2);
                            const imageLeft = isWidgetOnLeft ? widgetRect.x + widgetRect.width + 20 : 20;
                            const imageWidth = isWidgetOnLeft 
                                ? \`calc(100vw - \${imageLeft + 20}px)\`
                                : \`\${widgetRect.x - 40}px\`;
                            return (
                                <TransformComponent 
                                    wrapperStyle={{ 
                                        width: imageWidth, 
                                        height: '100dvh', 
                                        position: 'absolute', 
                                        left: isWidgetOnLeft ? \`\${imageLeft}px\` : '20px',
                                        top: 0 
                                    }} 
                                    contentStyle={{ width: '100%', height: '100%' }}
                                >
                                    <img 
                                        src={chatImagePreview} 
                                        alt="Chat Preview" 
                                        className="sheet-fade-in"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                                    />
                                </TransformComponent>
                            );
                        })()}
                        {/* Dummy element just to close the original TransformComponent tag if needed, but we'll replace the whole block */}`;

// Actually, let's be more precise with replacement so we don't duplicate the inner img tag
const oldFullBlock = `                    <TransformWrapper 
                        key={chatImagePreview}
                        initialScale={1} 
                        centerOnInit={true}
                        doubleClick={{ disabled: false }}
                        pinch={{ step: 5 }}
                    >
                        <TransformComponent wrapperStyle={{ width: 'calc(100vw - 390px)', height: '100dvh', position: 'absolute', right: 0, top: 0 }} contentStyle={{ width: '100%', height: '100%' }}>
                            <img 
                                src={chatImagePreview} 
                                alt="Chat Preview" 
                                className="sheet-fade-in"
                                style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                            />
                        </TransformComponent>
                    </TransformWrapper>`;

const newFullBlock = `                    <TransformWrapper 
                        key={chatImagePreview}
                        initialScale={1} 
                        centerOnInit={true}
                        doubleClick={{ disabled: false }}
                        pinch={{ step: 5 }}
                    >
                        {(() => {
                            const isWidgetOnLeft = (widgetRect.x + widgetRect.width / 2) < (window.innerWidth / 2);
                            const imageLeft = isWidgetOnLeft ? widgetRect.x + widgetRect.width + 20 : 20;
                            const imageWidth = isWidgetOnLeft 
                                ? \`calc(100vw - \${imageLeft + 20}px)\`
                                : \`\${widgetRect.x - 40}px\`;
                            return (
                                <TransformComponent 
                                    wrapperStyle={{ 
                                        width: imageWidth, 
                                        height: '100dvh', 
                                        position: 'absolute', 
                                        left: isWidgetOnLeft ? \`\${imageLeft}px\` : '20px',
                                        top: 0 
                                    }} 
                                    contentStyle={{ width: '100%', height: '100%' }}
                                >
                                    <img 
                                        src={chatImagePreview} 
                                        alt="Chat Preview" 
                                        className="sheet-fade-in"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                                    />
                                </TransformComponent>
                            );
                        })()}
                    </TransformWrapper>`;

if (file.includes(oldFullBlock)) {
    file = file.replace(oldFullBlock, newFullBlock);
} else {
    console.log("Could not find the full block to replace");
}

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Successfully patched IPadSheet.jsx with dynamic image sizing');
