const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

// The block to replace:
//             {imageUrl ? (
//                 <TransformWrapper 
//                     key={activeSong}
//                     initialScale={1} 
//                     centerOnInit={false}
//                     doubleClick={{ disabled: false }}
//                     pinch={{ step: 5 }}
//                 >
//                     <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
//                         <img 
//                             src={imageUrl} 
//                             alt={`Sheet Music for Song ${activeSong}`} 
//                             className="sheet-fade-in"
//                             style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right' }}
//                             onError={() => setImgError(true)}
//                         />
//                     </TransformComponent>
//                 </TransformWrapper>
//             ) : (

const oldRender = `            {imageUrl ? (
                <TransformWrapper 
                    key={activeSong}
                    initialScale={1} 
                    centerOnInit={false}
                    doubleClick={{ disabled: false }}
                    pinch={{ step: 5 }}
                >
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
                        <img 
                            src={imageUrl} 
                            alt={\`Sheet Music for Song \${activeSong}\`} 
                            className="sheet-fade-in"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right' }}
                            onError={() => setImgError(true)}
                        />
                    </TransformComponent>
                </TransformWrapper>
            ) : (`;

const newRender = `            {chatImagePreview ? (
                <TransformWrapper 
                    key={chatImagePreview}
                    initialScale={1} 
                    centerOnInit={false}
                    doubleClick={{ disabled: false }}
                    pinch={{ step: 5 }}
                >
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
                        <img 
                            src={chatImagePreview} 
                            alt="Chat Preview" 
                            className="sheet-fade-in"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right' }}
                        />
                    </TransformComponent>
                </TransformWrapper>
            ) : imageUrl ? (
                <TransformWrapper 
                    key={activeSong}
                    initialScale={1} 
                    centerOnInit={false}
                    doubleClick={{ disabled: false }}
                    pinch={{ step: 5 }}
                >
                    <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%' }}>
                        <img 
                            src={imageUrl} 
                            alt={\`Sheet Music for Song \${activeSong}\`} 
                            className="sheet-fade-in"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'right' }}
                            onError={() => setImgError(true)}
                        />
                    </TransformComponent>
                </TransformWrapper>
            ) : (`;

if (file.includes(oldRender)) {
    file = file.replace(oldRender, newRender);
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
    console.log('Fixed IPadSheet.jsx successfully');
} else {
    console.log('Could not find the exact string to replace. Here is what I am looking for:');
    console.log(oldRender);
}

