import HttpRequest from '../Services/HttpRequestService';
import moment from 'moment';
import Url from '../Services/Config.json';


export const getColorList = () => ([
    { id: 'col', title: 'col' },
    { id: 'bw', title: 'bw' },
]);

export const getDatasetList = () => ([
    { id: 'mrms', title: 'mrms' },
    { id: 'gpm', title: 'gpm' },
]);

export const getGrSiteList = () => ([
    { id: '1', title: 'KBOX' },
    { id: '2', title: 'KARX' },
    { id: '3', title: 'KBMX' },
    { id: '4', title: 'KBRO' },
    { id: '5', title: 'KBUF' },
    { id: '6', title: 'KBYX' },
    { id: '7', title: 'KCCX' },
    { id: '8', title: 'KCLX' },
    { id: '9', title: 'KCRP' },
    { id: '10', title: 'KDDC' },
    { id: '11', title: 'KDGX' },
    { id: '12', title: 'KDLH' },
    { id: '13', title: 'KDMX' },
    { id: '14', title: 'KDOX' },
    { id: '15', title: 'KDVN' },
    { id: '16', title: 'KEAX' },
    { id: '17', title: 'KEOX' },
    { id: '18', title: 'KEVX' },
    { id: '19', title: 'KFFC' },
    { id: '20', title: 'KFSD' },
    { id: '21', title: 'KFTG' },
    { id: '22', title: 'KFWS' },
    { id: '23', title: 'KGRK' },
    { id: '24', title: 'KGRR' },
    { id: '25', title: 'KHGX' },
    { id: '26', title: 'KHPX' },
    { id: '27', title: 'KHTX' },
    { id: '28', title: 'KICT' },
    { id: '29', title: 'KILN' },
    { id: '30', title: 'KILX' },
    { id: '31', title: 'KINX' },
    { id: '32', title: 'KIWX' },
    { id: '33', title: 'KJAX' },
    { id: '34', title: 'KJGX' },
    { id: '35', title: 'KJKL' },
    { id: '36', title: 'KLCH' },
    { id: '37', title: 'KLGX' },
    { id: '38', title: 'KLIX' },
    { id: '39', title: 'KLOT' },
    { id: '40', title: 'KLSX' },
    { id: '41', title: 'KLZK' },
    { id: '42', title: 'KMHX' },
    { id: '43', title: 'KMKX' },
    { id: '44', title: 'KMLB' },
    { id: '45', title: 'KMOB' },
    { id: '46', title: 'KMQT' },
    { id: '47', title: 'KMVX' },
    { id: '48', title: 'KNQA' },
    { id: '49', title: 'KOHX' },
    { id: '50', title: 'KOKX' },
    { id: '51', title: 'KPAH' },
    { id: '52', title: 'KPOE' },
    { id: '53', title: 'KRAX' },
    { id: '54', title: 'KSGF' },
    { id: '55', title: 'KSHV' },
    { id: '56', title: 'KSRX' },
    { id: '57', title: 'KTBW' },
    { id: '58', title: 'KTLH' },
    { id: '59', title: 'KTLX' },
    { id: '60', title: 'KTWX' },
    { id: '61', title: 'KTYX' },
    { id: '62', title: 'KVAX' },
    { id: '63', title: 'KVNX' },
    { id: '64', title: 'NPOL_MD' }
]);

export const getDataFetch = (values, startingDate, endingDate, settingCzml, fetchDataState) => {
    fetchDataState(true, false, false);

    let czmlLoad = {
        czml: []
    };
    let startDate = moment(startingDate).format("YY-MM-DD");
    let endDate = moment(endingDate).format("YY-MM-DD");
    let apiUrl = Url.Cesium.apiUrl;
    let dataResults = [];
    startDate = startDate.replace(/-/g, '');
    endDate = endDate.replace(/-/g, '');
    console.log(startDate, endDate);
    apiUrl = apiUrl.concat("start_date=", startDate, "&end_date=", endDate, "&color=", values.color, "&dataset=", values.dataset, "&gr_site=", values.gr_site, "&sort=true");
    console.log(apiUrl);

    HttpRequest(apiUrl).then(
        response => {
            if (response.data.errorType === "KeyError") {
                console.log(response.data);
                fetchDataState(false, true, false);


            } else if (response.data.status === "INVALID" || response.data.status === "EMPTY") {
                fetchDataState(false, true, false);
            } else if (response.data.status === "SUCCESS") {


                let json = {
                    id: "document",
                    name: "Image Transitions of CAPRi",
                    version: "1.0",
                };
                czmlLoad.czml.push(json);
                let apiData = response.data.data;

                for (let eachData of apiData) {

                    let imageEndDate = eachData.next_date;
                    const imageStartDate = eachData.date;
                    let dataView = {
                        id: imageStartDate,
                        title: imageStartDate,
                        coordinates: eachData.latlonbox_wsen,
                        image: eachData.png_file,
                    };

                    if (imageEndDate === "None") {
                        imageEndDate = moment(imageStartDate).add(1, 'days');
                        imageEndDate = moment(imageEndDate).format("YYYY-MM-DD");
                    }

                    let date = "";
                    date = date.concat(imageStartDate, "/", imageEndDate);

                    let jsonData = {
                        id: eachData.date,
                        name: imageStartDate,
                        description:
                            "<p>image for date " + imageStartDate + "</p>",
                        availability: date,
                        rectangle: {
                            coordinates: {
                                wsenDegrees: eachData.latlonbox_wsen,
                            },
                            material: {
                                image: {
                                    image: {},
                                    color: {
                                        rgba: [255, 255, 255, 220],
                                    },
                                },
                            },
                        },
                    };
                    let columnName = "uri";
                    jsonData['rectangle']['material']['image']['image'][columnName] = eachData.png_file;
                    czmlLoad.czml.push(jsonData);
                    dataResults.push(dataView);
                }

                settingCzml(czmlLoad.czml, dataResults);
                fetchDataState(false, false, false);


            }
        }
    );

}

export const getSingleImage = (viewer, singleTileLayer, toggleSliderState, settingSliderValue, props) => {
    toggleSliderState(true);
    viewer.current.clock.shouldAnimate = false;

    viewer.current.entities.removeAll();
    viewer.current.dataSources.removeAll();
    let Ces = window.Cesium;

    Ces.knockout.cleanNode(document.getElementById("toolbar"));
    if (singleTileLayer) {
        viewer.current.scene.imageryLayers.remove(singleTileLayer.current);
    }
    let layer = viewer.current.scene.imageryLayers;
    singleTileLayer.current = layer.addImageryProvider(
        new Ces.SingleTileImageryProvider({
            name: "image for date " + props.id,
            description:  "name",
            url: props.image,
            rectangle: Ces.Rectangle.fromDegrees(props.coordinates[0], props.coordinates[1], props.coordinates[2], props.coordinates[3]),
            credit: "image for date ",
        })
    );

    singleTileLayer.current.alpha = 0.7;
    singleTileLayer.current.colorToAlpha = new Ces.Color(0.0, 0.0, 0.0, 1.0);
    singleTileLayer.current.colorToAlphaThreshold = 0;


    var viewModel = {
        threshold: singleTileLayer.current.colorToAlphaThreshold,
    };
    viewer.current.entities.add({
        position: window.Cesium.Cartesian3.fromDegrees(props.coordinates[2], props.coordinates[3]),
        label: {
          text: "Date: " + props.id,
          font: "14px Helvetica"
        },
      });
    Ces.knockout.track(viewModel);

    var toolbar = document.getElementById("toolbar");
    Ces.knockout.applyBindings(viewModel, toolbar);

    Ces.knockout
        .getObservable(viewModel, "threshold")
        .subscribe(function (newValue) {
            settingSliderValue(newValue);
            singleTileLayer.current.colorToAlphaThreshold = parseFloat(
                viewModel.threshold
            );
        });

}

