from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import ugettext as _

from rest_framework import serializers

from rest_framework_jwt.serializers import JSONWebTokenSerializer
from rest_framework_jwt.settings import api_settings

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

UserModel = get_user_model()


class CustomJSONWebTokenSerializer(JSONWebTokenSerializer):

    def validate(self, attrs):
        credentials = {
            self.username_field: attrs.get(self.username_field),
            'password': attrs.get('password')
        }

        if all(credentials.values()):
            if UserModel.objects.filter(username=credentials[self.username_field]):
                user = authenticate(**credentials)

                if user:
                    if not user.is_active:
                        msg = _('User account is disabled.')
                        raise serializers.ValidationError(msg)
                    else:
                        payload = jwt_payload_handler(user)

                        return {
                            'token': jwt_encode_handler(payload),
                            'user': user
                        }
                else:
                    msg = 'invalid_password'
                    raise serializers.ValidationError(msg)
            else:
                msg = 'invalid_username'
                raise serializers.ValidationError(msg)
        else:
            msg = _('Must include "username_field" and "password".')
            msg = msg.format(username_field=self.username_field)
            raise serializers.ValidationError(msg)


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserModel
        fields = ('id', 'username', 'first_name', 'last_name', 'patronymic', 'chief')
