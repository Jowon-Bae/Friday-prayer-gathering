const fs = require('fs');

const ipadContent = fs.readFileSync('client/src/pages/IPadSheet.jsx', 'utf8');

const oldIpadBlock = `{hasInEarTargets && (
                                    <>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px', color: 'white' }}>제 인이어에</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' }}>
                                            {state.current_inear_targets.map(tId => (
                                                <div key={tId} className="member-cue" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.4rem', padding: '4px 10px', borderRadius: '8px', margin: '0' }}>
                                                    {inearTargetMap[tId] || tId}
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '4px', marginBottom: '8px', color: 'white' }}>소리를</div>
                                    </>
                                )}

                                {hasInEarAdj && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5px' }}>
                                        <div className="member-cue" style={{ backgroundColor: 'transparent', color: state.current_inear_vol > 0 ? '#ef4444' : '#3b82f6', fontSize: '2.2rem', padding: '0 0.5rem', margin: '0 0 5px 0' }}>
                                            {state.current_inear_vol > 0 ? \`+\${state.current_inear_vol}\` : state.current_inear_vol}
                                        </div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>
                                            {state.current_inear_vol > 0 ? '올려주세요' : '내려주세요'}
                                        </div>
                                    </div>
                                )}`;

const newBlock = `<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ccc' }}>제 인이어에</span>
                                    {hasInEarTargets && state.current_inear_targets.map(tId => (
                                        <span key={tId} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px' }}>
                                            {inearTargetMap[tId] || tId}
                                        </span>
                                    ))}
                                    {hasInEarTargets && <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ccc' }}>소리를</span>}
                                    {hasInEarAdj && (
                                        <>
                                            <span style={{ color: state.current_inear_vol > 0 ? '#ef4444' : '#3b82f6', fontSize: '1.6rem', fontWeight: '900', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                                                {state.current_inear_vol > 0 ? \`+\${state.current_inear_vol}\` : state.current_inear_vol}
                                            </span>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ccc' }}>
                                                {state.current_inear_vol > 0 ? '올려주세요' : '내려주세요'}
                                            </span>
                                        </>
                                    )}
                                </div>`;

if (ipadContent.includes(oldIpadBlock)) {
    fs.writeFileSync('client/src/pages/IPadSheet.jsx', ipadContent.replace(oldIpadBlock, newBlock));
    console.log('IPadSheet.jsx layout updated');
} else {
    console.log('Old block not found in IPadSheet.jsx');
}

const memberContent = fs.readFileSync('client/src/pages/Member.jsx', 'utf8');

const oldMemberBlock = `{hasInEarTargets && (
                        <>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2px', color: 'white' }}>제 인이어에</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px' }}>
                                {state.current_inear_targets.map(tId => (
                                    <div key={tId} className="member-cue" style={{ backgroundColor: 'transparent', color: '#111', fontSize: '2rem', padding: '0 0.5rem', margin: '0' }}>
                                        {inearTargetMap[tId] || tId}
                                    </div>
                                ))}
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '2px', marginBottom: '2px', color: 'white' }}>소리를</div>
                        </>
                    )}

                    {hasInEarAdj && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="member-cue" style={{ backgroundColor: 'transparent', color: state.current_inear_vol > 0 ? '#d32f2f' : '#1976d2', fontSize: '2.5rem', padding: '0 0.5rem', margin: '0 0 2px 0' }}>
                                {state.current_inear_vol > 0 ? \`+\${state.current_inear_vol}\` : state.current_inear_vol}
                            </div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white' }}>
                                {state.current_inear_vol > 0 ? '올려주세요' : '내려주세요'}
                            </div>
                        </div>
                    )}`;

const newMemberBlock = `<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ccc' }}>제 인이어에</span>
                        {hasInEarTargets && state.current_inear_targets.map(tId => (
                            <span key={tId} style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '1.1rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '8px' }}>
                                {inearTargetMap[tId] || tId}
                            </span>
                        ))}
                        {hasInEarTargets && <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ccc' }}>소리를</span>}
                        {hasInEarAdj && (
                            <>
                                <span style={{ color: state.current_inear_vol > 0 ? '#ff5252' : '#448aff', fontSize: '1.6rem', fontWeight: '900', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                                    {state.current_inear_vol > 0 ? \`+\${state.current_inear_vol}\` : state.current_inear_vol}
                                </span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ccc' }}>
                                    {state.current_inear_vol > 0 ? '올려주세요' : '내려주세요'}
                                </span>
                            </>
                        )}
                    </div>`;

if (memberContent.includes(oldMemberBlock)) {
    fs.writeFileSync('client/src/pages/Member.jsx', memberContent.replace(oldMemberBlock, newMemberBlock));
    console.log('Member.jsx layout updated');
} else {
    console.log('Old block not found in Member.jsx');
}
