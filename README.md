# Pre Setup

* Install nginx
```bash
> brew install nginx
```

* Modify nginx config file
```
> vim /usr/local/etc/nginx/nginx.conf
    server {
        listen       8080;
        server_name  devcompany.com;
        location /api/ {
            proxy_pass http://devcompany.com:4000;
        }

        location / {
            proxy_pass http://devcompany.com:3000;
        }
    }
> sudo nginx -s reload
```

* Add custom host
```
> sudo vim /etc/hosts

127.0.0.1       devcompany.com
```

# Start Services

```
> bundle install
> source set_env_vars.sh
> rails s -p 3000
```

#Go to browser
http://devcompany.com:8080/login


