export default class InteractiveMap {
  constructor(mapId, onClick) {
    this.mapId = mapId;
    this.onClick = onClick;
  }

  async init() {
    await this.addYMapScripts();
    await this.loadYMaps();
    this.initMap();
  }
  addYMapScripts() {
    return new Promise((resolve) => {
      const ymapsScript = document.createElement('script');
      ymapsScript.src =
        'https://api-maps.yandex.ru/2.1/?apikey=d37743d4-8576-4f45-a4a1-3e794a0a3d10&lang=ru_RU';
      document.body.appendChild(ymapsScript);
      ymapsScript.addEventListener('load', resolve);
    });
  }
  loadYMaps() {
    return new Promise((resolve) => ymaps.ready(resolve));
  }
  initMap() {
   
    this.clusterer = new ymaps.Clusterer({ // Создание кластера для группировки объектов
      groupByCoordinates: true,
      clusterDisableClickZoom: true,
      clusterOpenBalloonOnClick: false,
    });
    this.clusterer.events.add('click', (e) => { 
      const coords = e.get('target').geometry.getCoordinates();
      this.onClick(coords);
    });
    this.map = new ymaps.Map(this.mapId, {
      center: [59.94, 30.4],
      zoom: 11, behavior: 'drag'
    });
    this.map.events.add('click', (e) => this.onClick(e.get('coords'))); //При клике на карту в функцию onClick передаются координаты
    
    this.map.geoObjects.add(this.clusterer);
  }
  openBalloon(coords, content) {
    this.map.balloon.open(coords, content);
  }
  setBalloonContent(content) {
    this.map.balloon.setData(content);
  }
  closeBalloon() {
    this.map.balloon.close();
  }
  createPlacemark(coords) {
    const placemark = new ymaps.Placemark(coords);
    placemark.events.add('click', (e)=>{
      const coords = e.get('target').geometry.getCoordinates();
      this.onClick(coords);
    })
    this.clusterer.add(placemark)
  }
}
