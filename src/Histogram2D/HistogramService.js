export const getXaxisList = () => ([
    { id: '1', title: 'gr_rc_rainrate' },
    { id: '2', title: 'GR_Z_s2Ku' },
    { id: '3', title: 'GR_Dm' },
    { id: '4', title: 'GR_Nw' },
    { id: '5', title: 'gr_z_stddev' },

]);

export const getYaxisList = () => ([
    { id: '1', title: 'zFactorCorrected' },
    { id: '2', title: 'preciprate' },
    { id: '3', title: 'Dm' },
    { id: '4', title: 'Nw' },
    { id: '5', title: 'zFactorMeasured' },
])

export const getSensorTypeList = () => ([
    { id: '1', title: 'DPR' },
    { id: '2', title: 'Ka' },
    { id: '3', title: 'Ku' },
    { id: '4', title: 'DPRGMI' },
])

export const getScanTypeList = (props) => {
    if (props === 'DPR' ) {
        return ([
            { id: '1', title: 'None' },
            { id: '2', title: 'NS' },
        ])

    }
    else if(props === 'Ka' ) {
        return ([
            { id: '1', title: 'None' },
            { id: '2', title: 'MS' },
        ])

    }else if(props === 'Ku' ) {
        return ([
            { id: '1', title: 'None' },
            { id: '2', title: 'NS' },
        ])

    }else if(props === 'DPRGMI' ) {
        return ([
            { id: '1', title: 'None' },
            { id: '2', title: 'NS' },
            { id: '3', title: 'MS' }
        ])

    }

}