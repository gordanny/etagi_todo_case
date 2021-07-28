from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm

    list_display = ('username', 'last_name', 'first_name', 'patronymic', 'chief', 'is_admin', 'is_active')
    list_filter = ('is_admin',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('last_name', 'first_name', 'patronymic', 'chief', 'is_active')}),
        ('Permissions', {'fields': ('is_admin',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username',
                'password1',
                'password2',
                'last_name',
                'first_name',
                'patronymic',
                'chief',
                'is_admin',
                'is_active'
            ),
        }),
    )
    search_fields = ('username', 'first_name', 'last_name', 'patronymic', 'chief')
    ordering = ('username', 'first_name', 'last_name', 'patronymic', 'chief')
    filter_horizontal = ()


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.unregister(Group)
