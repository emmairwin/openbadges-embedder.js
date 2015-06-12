// -*- Mode: js2; tab-width: 2; indent-tabs-mode: nil; js2-basic-offset: 2; js2-skip-preprocessor-directives: t; -*-

(function() {
  const base = 'https://backpack.openbadges.org';

  function json(url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.overrideMimeType("application/json");
      req.onload = function() {
        var json = JSON.parse(this.responseText);
        resolve(json);
      };
      req.open("get", url, true);
      req.send();
    });
  }

  function groups(id) {
    // Like https://backpack.openbadges.org/displayer/3040/groups.json
    const url = base + '/displayer/' + id + '/groups.json';
    return json(url);
  }

  function badges(id, group) {
    // Like https://backpack.openbadges.org/displayer/3040/group/17260.json
    const url = base + '/displayer/' + id + '/group/' + group + '.json';
    return json(url);
  }

  const container = document.getElementById('openbadges_container');
  const ul = document.createElement('ul');
  container.appendChild(ul);

  groups(3040).then(function(data) {
    var ps = [];
    for (var group of data.groups) {
      ps.push(badges(3040, group.groupId));
    }
    return Promise.all(ps);
  }).then(function(data) {
    for (var result of data) {
      for (var badge of result.badges) {
        const li = document.createElement('li');
        var img = document.createElement('img');
        img.src = badge.imageUrl;
        img.style.maxWidth = '128px';
        img.style.maxHeight = '128px';
        li.appendChild(img);
        ul.appendChild(li);
      }
    }
  });
})();
