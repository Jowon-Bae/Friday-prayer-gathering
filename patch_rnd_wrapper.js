const fs = require('fs');

let file = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const oldRndStart = `<Rnd
                default={{
                    x: 20,
                    y: 160,
                    width: 350,
                    height: 700,
                }}
                minWidth={250}
                bounds="parent"
                dragHandleClassName="drag-handle"
                style={{ zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
                {/* FLASH TRANSITION TEXT (Above the box) */}
                {isTransitioning && (`;

const newRndStart = `<Rnd
                default={{
                    x: 20,
                    y: 160,
                    width: 350,
                    height: 700,
                }}
                minWidth={250}
                minHeight={350}
                bounds="parent"
                dragHandleClassName="drag-handle"
                style={{ zIndex: 5 }}
            >
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* FLASH TRANSITION TEXT (Above the box) */}
                {isTransitioning && (`;

file = file.replace(oldRndStart, newRndStart);

// We need to add closing </div> before </Rnd>
const oldRndEnd = `                        </div>
                    </div>
                </div>
            </Rnd>`;

const newRndEnd = `                        </div>
                    </div>
                </div>
                </div>
            </Rnd>`;

file = file.replace(oldRndEnd, newRndEnd);

fs.writeFileSync('client/src/pages/IPadSheet.jsx', file);
console.log('Patched Rnd wrapper successfully');
